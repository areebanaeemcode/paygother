from django.db import transaction as db_transaction
from django.utils.dateparse import parse_date
from django.shortcuts import get_object_or_404
from django.db.models import DecimalField
from decimal import Decimal

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import OrderingFilter

from apps.tours.models import Tour
from .models import Expense, ExpenseSplit, Receipt, ExpenseLimit
from .permissions import IsTourMember, IsExpenseEditor
from .serializers import (
    ExpenseReadSerializer,
    ExpenseCreateUpdateSerializer,
    ReceiptUploadSerializer,
    ExpenseLimitReadSerializer,
    ExpenseLimitWriteSerializer,
)
from .limit_utils import (
    annotate_limit_with_spending,
    check_expense_limits_for_tour,
)


def _alerts_for_user(limit_checks, user_id, amount=None, tour=None):
    out = {
        'limit_exceeded': False,
        'just_crossed': False,
        'limit_amount': None,
        'total_spent': None,
        'remaining': None,
    }
    if not user_id:
        return out
    if limit_checks and user_id in limit_checks:
        r = limit_checks[user_id]
        out['limit_exceeded'] = r.get('limit_exceeded', False)
        out['just_crossed'] = r.get('just_crossed', False)
        out['limit_amount'] = r.get('limit_amount')
        out['total_spent'] = r.get('total_spent')
        out['remaining'] = r.get('remaining')
        return out
    if tour:
        lim = ExpenseLimit.objects.filter(tour=tour, user_id=user_id).first()
        if lim:
            lim = annotate_limit_with_spending(lim)
            out['limit_exceeded'] = bool(lim.limit_exceeded)
            out['limit_amount'] = float(lim.amount)
            out['total_spent'] = float(lim.total_spent)
            out['remaining'] = float(lim.remaining)
    return out


class ExpenseListAPI(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsTourMember]
    serializer_class = ExpenseReadSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['paid_at', 'created_at', 'amount']
    ordering = ['-paid_at', '-created_at']

    def get_queryset(self):
        return Expense.objects.select_related('tour', 'paid_by').prefetch_related(
            'splits', 'splits__user', 'receipt'
        )

    def list(self, request, *args, **kwargs):
        tour_id = request.query_params.get('tour_id') or request.data.get('tour_id')
        if not tour_id:
            return Response(
                {'detail': 'tour_id query parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        tour = get_object_or_404(Tour, pk=tour_id)
        if not tour.is_member(request.user):
            return Response(
                {'detail': 'You are not a member of this tour.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        qs = self.filter_queryset(self.get_queryset().filter(tour=tour))

        category = request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        pm = request.query_params.get('payment_method')
        if pm:
            qs = qs.filter(payment_method=pm)
        dfrom = request.query_params.get('date_from')
        if dfrom:
            d = parse_date(dfrom)
            if d:
                qs = qs.filter(paid_at__date__gte=d)
        dto = request.query_params.get('date_to')
        if dto:
            d = parse_date(dto)
            if d:
                qs = qs.filter(paid_at__date__lte=d)

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

class ExpenseCreateAPI(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def post(self, request, *args, **kwargs):
        tour_id = request.data.get('tour_id')
        if not tour_id:
            return Response(
                {'detail': 'tour_id is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        tour = get_object_or_404(Tour, pk=tour_id)
        if not tour.is_member(request.user):
            return Response(
                {'detail': 'You are not a member of this tour.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = ExpenseCreateUpdateSerializer(
            data=request.data, context={'request': request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        expense = serializer.save()
        # Run expense-limit checks for paid_by after expense write
        paid_by_id = getattr(expense, 'paid_by_id', None)
        affected_user_ids = set()
        if paid_by_id:
            affected_user_ids.add(paid_by_id)
        limit_checks = check_expense_limits_for_tour(tour, affected_users=list(affected_user_ids))
        # Fire notifications for new_expense (tour members except paid_by and creator)
        new_notifs = 0
        try:
            from apps.notifications.hooks import notify_new_expense
            new_notifs = notify_new_expense(expense)
        except Exception:
            pass
        expense = (
            Expense.objects.filter(pk=expense.pk)
            .select_related('tour', 'paid_by')
            .prefetch_related('splits', 'splits__user', 'receipt')
            .first()
        )
        read = ExpenseReadSerializer(expense, context={'request': request})
        data = dict(read.data)
        data['alerts'] = {
            'actor': _alerts_for_user(limit_checks, request.user.id, tour=tour),
            'paid_by': _alerts_for_user(limit_checks, paid_by_id, tour=tour),
        }
        return Response(data, status=status.HTTP_201_CREATED)


class ExpenseDetailAPI(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Expense.objects.select_related('tour', 'paid_by').prefetch_related(
        'splits', 'splits__user', 'receipt'
    )
    serializer_class = ExpenseReadSerializer

    def get_permissions(self):
        perms = [IsAuthenticated()]
        if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
            perms.append(IsTourMember())
        else:
            perms.append(IsExpenseEditor())
        return perms

    def get_serializer_class(self):
        if self.request.method in ('PATCH', 'PUT', 'POST'):
            return ExpenseCreateUpdateSerializer
        return ExpenseReadSerializer

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ExpenseReadSerializer(instance, context={'request': request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        tour = instance.tour
        old_paid_by_id = getattr(instance, 'paid_by_id', None)
        serializer = ExpenseCreateUpdateSerializer(
            instance, data=request.data, partial=partial, context={'request': request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        updated = serializer.save()
        new_paid_by_id = getattr(updated, 'paid_by_id', None)
        affected = {u for u in (old_paid_by_id, new_paid_by_id) if u}
        limit_checks = check_expense_limits_for_tour(tour, affected_users=list(affected))
        # Fire expense update notifications as new_expense for tour members except paid_by/creator
        try:
            from apps.notifications.hooks import notify_new_expense
            notify_new_expense(updated)
        except Exception:
            pass
        updated = (
            Expense.objects.filter(pk=updated.pk)
            .select_related('tour', 'paid_by')
            .prefetch_related('splits', 'splits__user', 'receipt')
            .first()
        )
        read = ExpenseReadSerializer(updated, context={'request': request})
        data = dict(read.data)
        data['alerts'] = {
            'actor': _alerts_for_user(limit_checks, request.user.id, tour=tour),
            'paid_by': _alerts_for_user(limit_checks, new_paid_by_id, tour=tour),
        }
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


class ExpenseDeleteAPI(APIView):
    permission_classes = [IsAuthenticated, IsExpenseEditor]

    def delete(self, request, pk, *args, **kwargs):
        expense = get_object_or_404(
            Expense.objects.select_related('tour').prefetch_related('splits'),
            pk=pk,
        )
        self.check_object_permissions(request, expense)
        tour = expense.tour
        paid_by_id = getattr(expense, 'paid_by_id', None)
        with db_transaction.atomic():
            expense.delete()
        limit_checks = {}
        if paid_by_id:
            limit_checks = check_expense_limits_for_tour(tour, affected_users=[paid_by_id])
        resp = {
            'detail': 'Expense deleted',
            'alerts': {
                'actor': _alerts_for_user(limit_checks, request.user.id, tour=tour),
                'paid_by': _alerts_for_user(limit_checks, paid_by_id, tour=tour),
            } if (paid_by_id or limit_checks) else {'actor': _alerts_for_user({}, request.user.id, tour=tour), 'paid_by': {}},
        }
        return Response(resp, status=status.HTTP_200_OK)


class ReceiptUploadAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        expense = get_object_or_404(
            Expense.objects.select_related('tour').prefetch_related('receipt'),
            pk=pk,
        )
        if not expense.tour.is_member(request.user):
            return Response(
                {'detail': 'You are not a member of this tour.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = ReceiptUploadSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        image_file = serializer.validated_data['image']
        with db_transaction.atomic():
            receipt = getattr(expense, 'receipt', None)
            is_new = receipt is None
            old_image = None
            if is_new:
                receipt = Receipt(expense=expense)
            else:
                old_image = receipt.image
            receipt.image = image_file
            receipt.uploaded_by = request.user
            if is_new or receipt.verified_by_id is None:
                receipt.verified_by = request.user
                from django.utils import timezone
                receipt.verified_at = timezone.now()
            receipt.save()
            expense.save(update_fields=['updated_at'])
            if old_image and old_image != receipt.image:
                try:
                    old_image.delete(save=False)
                except Exception:
                    pass
        expense = (
            Expense.objects.filter(pk=expense.pk)
            .select_related('tour', 'paid_by')
            .prefetch_related('splits', 'splits__user', 'receipt')
            .first()
        )
        read = ExpenseReadSerializer(expense, context={'request': request})
        return Response(read.data, status=status.HTTP_201_CREATED if is_new else status.HTTP_200_OK)


class ReceiptVerifyAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        expense = get_object_or_404(
            Expense.objects.select_related('tour').prefetch_related('receipt'),
            pk=pk,
        )
        if not expense.tour.is_member(request.user):
            return Response(
                {'detail': 'You are not a member of this tour.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        receipt = getattr(expense, 'receipt', None)
        if not receipt or not receipt.image:
            return Response(
                {'detail': 'This expense does not have a receipt yet.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        receipt.mark_verified(request.user)
        expense = (
            Expense.objects.filter(pk=expense.pk)
            .select_related('tour', 'paid_by')
            .prefetch_related('splits', 'splits__user', 'receipt')
            .first()
        )
        read = ExpenseReadSerializer(expense, context={'request': request})
        return Response(read.data, status=status.HTTP_200_OK)


class ExpenseLimitAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def _serialize(self, limit):
        limit = annotate_limit_with_spending(limit)
        obj = {
            'id': limit.id,
            'tour_id': limit.tour_id,
            'user_id': limit.user_id,
            'amount': float(limit.amount),
            'total_spent': float(limit.total_spent),
            'remaining': float(limit.remaining),
            'limit_exceeded': bool(limit.limit_exceeded),
            'last_notified_exceeded': bool(limit.last_notified_exceeded),
            'updated_at': limit.updated_at.isoformat() if limit.updated_at else None,
        }
        return obj

    def get(self, request, *args, **kwargs):
        tour_id = request.query_params.get('tour_id')
        if not tour_id:
            return Response({'detail': 'tour_id query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            tour_id = int(tour_id)
        except (TypeError, ValueError):
            return Response({'detail': 'tour_id must be integer.'}, status=status.HTTP_400_BAD_REQUEST)
        tour = get_object_or_404(Tour, pk=tour_id)
        if not tour.is_member(request.user):
            return Response({'detail': 'You are not a member of this tour.'}, status=status.HTTP_403_FORBIDDEN)
        limit = ExpenseLimit.objects.filter(tour=tour, user=request.user).first()
        if not limit:
            return Response({
                'id': None,
                'tour_id': tour_id,
                'user_id': request.user.id,
                'amount': None,
                'total_spent': 0.0,
                'remaining': None,
                'limit_exceeded': False,
                'last_notified_exceeded': False,
                'updated_at': None,
            }, status=status.HTTP_200_OK)
        return Response(self._serialize(limit), status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        serializer = ExpenseLimitWriteSerializer(data=request.data or {})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        tour_id = serializer.validated_data['tour_id']
        amount = serializer.validated_data['amount']
        tour = get_object_or_404(Tour, pk=tour_id)
        if not tour.is_member(request.user):
            return Response({'detail': 'You are not a member of this tour.'}, status=status.HTTP_403_FORBIDDEN)
        with db_transaction.atomic():
            limit, created = ExpenseLimit.objects.select_for_update().get_or_create(
                tour=tour,
                user=request.user,
                defaults={'amount': amount},
            )
            if not created:
                old_amount = limit.amount
                limit.amount = amount
                # If user raises the limit, clear last_notified so user can be notified on next cross
                if amount > old_amount:
                    limit.last_notified_exceeded = False
                limit.save(update_fields=['amount', 'last_notified_exceeded', 'updated_at'])
            # Re-run limit checks against user after upsert
            check_expense_limits_for_tour(tour, affected_users=[request.user.id])
        data = self._serialize(limit)
        return Response(data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        return self.put(request, *args, **kwargs)


import json
import stripe
from django.conf import settings


class StripeCreateCheckoutSessionAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        stripe_key = getattr(settings, 'STRIPE_SECRET_KEY', '') or ''
        if not stripe_key:
            return Response(
                {'detail': 'Stripe secret key is not configured on the server.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        stripe.api_key = stripe_key

        tour_id = request.data.get('tour_id')
        if not tour_id:
            return Response({'detail': 'tour_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        tour = get_object_or_404(Tour, pk=tour_id)
        if not tour.is_member(request.user):
            return Response({'detail': 'You are not a member of this tour.'}, status=status.HTTP_403_FORBIDDEN)

        title = (request.data.get('title') or 'Tour Expense').strip()[:200]
        try:
            amount = float(request.data.get('amount') or 0)
        except (ValueError, TypeError):
            amount = 0.0

        if amount <= 0:
            return Response({'detail': 'A valid positive amount is required.'}, status=status.HTTP_400_BAD_REQUEST)

        category = request.data.get('category') or 'other'
        paid_by_id = request.data.get('paid_by') or request.user.id
        split_members = request.data.get('split_members') or []
        share_amounts = request.data.get('share_amounts') or []
        notes = request.data.get('notes') or ''
        paid_at = request.data.get('paid_at') or ''

        base_url = request.build_absolute_uri('/')[:-1]
        success_url = f"{base_url}/client/tours/{tour_id}/?stripe_session_id={{CHECKOUT_SESSION_ID}}&payment_status=success"
        cancel_url = f"{base_url}/client/tours/{tour_id}/?payment_status=cancelled"

        metadata = {
            'tour_id': str(tour_id),
            'title': title[:200],
            'category': str(category),
            'paid_by_id': str(paid_by_id),
            'user_id': str(request.user.id),
            'notes': str(notes)[:350],
            'paid_at': str(paid_at)[:50],
            'split_members_json': json.dumps(split_members)[:400],
            'share_amounts_json': json.dumps(share_amounts)[:400],
        }

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'pkr',
                        'product_data': {
                            'name': f"{tour.title} — {title}",
                            'description': f"Category: {category.title()} | Paid by member #{paid_by_id}",
                        },
                        'unit_amount': int(round(amount * 100)),
                    },
                    'quantity': 1,
                }],
                mode='payment',
                customer_email=request.user.email if (request.user.email and '@' in request.user.email) else None,
                metadata=metadata,
                success_url=success_url,
                cancel_url=cancel_url,
            )
            return Response({
                'checkout_url': session.url,
                'session_id': session.id,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': f"Stripe Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class StripeVerifySessionAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        stripe_key = getattr(settings, 'STRIPE_SECRET_KEY', '') or ''
        if not stripe_key:
            return Response({'detail': 'Stripe key not configured.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        stripe.api_key = stripe_key

        session_id = request.data.get('session_id')
        if not session_id:
            return Response({'detail': 'session_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            session = stripe.checkout.Session.retrieve(session_id)
        except Exception as e:
            return Response({'detail': f"Could not retrieve Stripe session: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        if session.payment_status != 'paid':
            return Response({
                'detail': 'Payment is not completed.',
                'payment_status': session.payment_status
            }, status=status.HTTP_400_BAD_REQUEST)

        meta = session.metadata or {}
        tour_id = meta.get('tour_id')
        tour = get_object_or_404(Tour, pk=tour_id)
        if not tour.is_member(request.user):
            return Response({'detail': 'Not a tour member.'}, status=status.HTTP_403_FORBIDDEN)

        marker = f"stripe_session:{session_id}"
        existing = Expense.objects.filter(tour=tour, notes__contains=marker).first()
        if existing:
            serializer = ExpenseReadSerializer(existing, context={'request': request})
            return Response({
                'status': 'already_recorded',
                'expense': serializer.data,
                'amount': float(existing.amount),
                'payment_intent': session.payment_intent,
            }, status=status.HTTP_200_OK)

        amount = Decimal(session.amount_total or 0) / Decimal(100)
        title = meta.get('title') or 'Stripe Expense'
        category = meta.get('category') or 'other'
        paid_by_id = int(meta.get('paid_by_id') or request.user.id)
        original_notes = meta.get('notes') or ''
        full_notes = f"{original_notes}\n[Stripe Paid: {session.payment_intent} | {marker}]".strip()

        split_members = []
        try:
            split_members = json.loads(meta.get('split_members_json') or '[]')
        except Exception:
            pass

        share_amounts = []
        try:
            share_amounts = json.loads(meta.get('share_amounts_json') or '[]')
        except Exception:
            pass

        paid_at = meta.get('paid_at')

        payload = {
            'tour_id': tour.id,
            'title': title,
            'amount': float(amount),
            'category': category,
            'payment_method': 'stripe',
            'paid_by': paid_by_id,
            'split_members': split_members,
            'share_amounts': share_amounts,
            'notes': full_notes,
        }
        if paid_at:
            payload['paid_at'] = paid_at

        serializer = ExpenseCreateUpdateSerializer(data=payload, context={'request': request})
        if not serializer.is_valid():
            with db_transaction.atomic():
                exp = Expense.objects.create(
                    tour=tour,
                    title=title,
                    amount=amount,
                    category=category,
                    payment_method='stripe',
                    paid_by_id=paid_by_id,
                    notes=full_notes,
                    created_by=request.user,
                )
                if not split_members:
                    split_members = list(tour.members.values_list('user_id', flat=True)) or [paid_by_id]
                each_share = round(amount / len(split_members), 2)
                for uid in split_members:
                    ExpenseSplit.objects.create(expense=exp, user_id=uid, share_amount=each_share)
                expense = exp
        else:
            expense = serializer.save()

        affected_user_ids = [paid_by_id]
        check_expense_limits_for_tour(tour, affected_users=affected_user_ids)
        try:
            from apps.notifications.hooks import notify_new_expense
            notify_new_expense(expense)
        except Exception:
            pass

        read = ExpenseReadSerializer(expense, context={'request': request})
        return Response({
            'status': 'success',
            'expense': read.data,
            'amount': float(amount),
            'payment_intent': session.payment_intent,
        }, status=status.HTTP_201_CREATED)


class StripeSettlementCheckoutAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        stripe_key = getattr(settings, 'STRIPE_SECRET_KEY', '') or ''
        if not stripe_key:
            return Response({'detail': 'Stripe key not configured.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        stripe.api_key = stripe_key

        tour_id = request.data.get('tour_id')
        to_name = request.data.get('to_name') or 'Tour Member'
        tx_key = request.data.get('tx_key') or ''
        try:
            amount = float(request.data.get('amount') or 0)
        except (ValueError, TypeError):
            amount = 0.0

        if not tour_id or amount <= 0:
            return Response({'detail': 'tour_id and a valid positive amount are required.'}, status=status.HTTP_400_BAD_REQUEST)

        tour = get_object_or_404(Tour, pk=tour_id)
        if not tour.is_member(request.user):
            return Response({'detail': 'Not a tour member.'}, status=status.HTTP_403_FORBIDDEN)

        base_url = request.build_absolute_uri('/')[:-1]
        success_url = f"{base_url}/client/tours/{tour_id}/settlement/?stripe_settlement=success&tx_key={tx_key}&amount={amount}&to_name={to_name}&session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{base_url}/client/tours/{tour_id}/settlement/?stripe_settlement=cancelled"

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'pkr',
                        'product_data': {
                            'name': f"Settlement Payment to {to_name}",
                            'description': f"Tour: {tour.title} — Settlement of debt",
                        },
                        'unit_amount': int(round(amount * 100)),
                    },
                    'quantity': 1,
                }],
                mode='payment',
                customer_email=request.user.email if (request.user.email and '@' in request.user.email) else None,
                metadata={
                    'tour_id': str(tour_id),
                    'tx_key': str(tx_key),
                    'to_name': str(to_name),
                    'amount': str(amount),
                    'type': 'settlement',
                },
                success_url=success_url,
                cancel_url=cancel_url,
            )
            return Response({
                'checkout_url': session.url,
                'session_id': session.id,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': f"Stripe Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

