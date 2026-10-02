from django.shortcuts import redirect
from django.views.generic import TemplateView, View, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import login as django_login
from django.urls import reverse_lazy
from django.core.mail import send_mail
from django.conf import settings
import random
import time

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    ProfileUpdateSerializer,
)
from .models import User


def send_otp_email(to_email, otp_code, user_name="User"):
    subject = "Pay-Together — Email Verification Code"
    message = (
        f"Hello {user_name},\n\n"
        f"Your 6-digit verification code is: {otp_code}\n\n"
        f"This code will expire in 5 minutes.\n\n"
        f"Thank you,\nPay-Together Team"
    )
    html_message = f"""
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:28px 24px;border:1px solid #e2e8f0;border-radius:12px;background:#ffffff;">
        <div style="text-align:center;margin-bottom:24px;">
            <h2 style="color:#2b1816;margin:0;font-size:24px;">Pay-Together</h2>
            <p style="color:#64748b;margin:6px 0 0;font-size:14px;">Smart Group Expense Sharing Platform</p>
        </div>
        <p style="font-size:15px;color:#1e293b;margin-bottom:8px;">Hello <strong>{user_name}</strong>,</p>
        <p style="font-size:14px;color:#475569;line-height:1.6;margin-bottom:20px;">
            Thank you for signing up! Enter the 6-digit verification code below to verify your email and complete your registration.
        </p>
        <div style="text-align:center;margin:28px 0;">
            <div style="display:inline-block;padding:16px 36px;background:#fdf9f7;border:2px dashed #2b1816;border-radius:10px;">
                <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#2b1816;">{otp_code}</span>
            </div>
        </div>
        <p style="font-size:13px;color:#64748b;text-align:center;margin-top:24px;">
            This code expires in <strong>5 minutes</strong>. If you did not request this, please ignore this email.
        </p>
    </div>
    """
    print(f"\n========================================", flush=True)
    print(f"[Pay-Together OTP] Generated for: {to_email}", flush=True)
    print(f"[Pay-Together OTP] Code: {otp_code}", flush=True)
    print(f"========================================\n", flush=True)

    # Standard configured Django SMTP backend (supports all real emails, Gmail, Outlook, Yopmail, etc.)
    try:
        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "Pay-Together <ef91646@gmail.com>")
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=[to_email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"[Pay-Together OTP] Email successfully sent via SMTP to: {to_email}", flush=True)
        return True
    except Exception as e:
        print(f"[OTP Email Notice] SMTP delivery skipped or error: {e}. Code logged above & available on screen.", flush=True)
        return False



class LandingPageView(TemplateView):
    template_name = "landing.html"

    def dispatch(self, request, *args, **kwargs):
        if request.get_host().endswith(":8001"):
            if request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser):
                return redirect("/client/admin/")
            return redirect("/login/?next=/client/admin/")
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        user = self.request.user
        ctx["is_authenticated"] = user.is_authenticated
        if user.is_authenticated:
            ctx["user_name"] = user.first_name or user.email.split("@")[0]
            ctx["dashboard_url"] = "/client/dashboard/"
        else:
            ctx["login_url"] = "/login/"
            ctx["register_url"] = "/register/"
        return ctx


class RootRedirectView(View):
    def get(self, request):
        if request.get_host().endswith(":8001"):
            return redirect("/client/admin/")
        return redirect("/")


class AuthenticatedRedirectMixin:
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            if request.get_host().endswith(":8001"):
                if request.user.is_staff or request.user.is_superuser:
                    return redirect("/client/admin/")
                return redirect("http://127.0.0.1:8000/client/dashboard/")
            return redirect("/client/dashboard/")
        return super().dispatch(request, *args, **kwargs)


class RegisterPageView(AuthenticatedRedirectMixin, TemplateView):
    template_name = "auth/register.html"


class VerifyOTPPageView(AuthenticatedRedirectMixin, TemplateView):
    template_name = "auth/verify_otp.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        pending = self.request.session.get("pending_registration") or {}
        email = pending.get("email", "")
        if email and "@" in email:
            parts = email.split("@")
            user_part = parts[0]
            masked_user = user_part[:2] + "***" if len(user_part) > 2 else user_part + "***"
            ctx["masked_email"] = f"{masked_user}@{parts[1]}"
        else:
            ctx["masked_email"] = email or "your email"
        ctx["has_pending"] = bool(pending)
        ctx["email_sent"] = pending.get("email_sent", False)
        ctx["debug_otp"] = pending.get("otp_code", "")
        ctx["target_email"] = email
        return ctx


class LoginPageView(AuthenticatedRedirectMixin, TemplateView):
    template_name = "auth/login.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["is_admin_portal"] = self.request.get_host().endswith(":8001")
        return ctx


class DashboardPageView(LoginRequiredMixin, TemplateView):
    template_name = "dashboard/dashboard.html"

    def get_context_data(self, **kwargs):
        from apps.tours.models import Tour
        ctx = super().get_context_data(**kwargs)
        ctx["tour_create_url"] = "/client/tours/create/"
        ctx["tour_list_url"] = "/client/tours/"
        ctx["analytics_url"] = "/client/analytics/"
        ctx["notifications_list_url"] = "/client/notifications/"
        ctx["profile_url"] = "/client/profile/"
        ctx["join_tour_api_url"] = "/client/tours/api/join/"
        user = self.request.user
        recent = []
        try:
            tours = list(
                Tour.objects.filter(memberships__user=user)
                .select_related("created_by")
                .distinct()
                .order_by("-created_at")[:5]
            )
            for t in tours:
                creator = t.created_by
                recent.append({
                    "id": t.pk,
                    "title": t.title,
                    "destination": t.destination or "",
                    "start_date": str(t.start_date) if t.start_date else "",
                    "end_date": str(t.end_date) if t.end_date else "",
                    "budget": str(t.budget) if t.budget is not None else "0.00",
                    "join_token": t.join_token or "",
                    "creator_name": (
                        f"{getattr(creator, 'first_name', '') or ''} {getattr(creator, 'last_name', '') or ''}".strip()
                        or getattr(creator, "email", "") or "Unknown"
                    ),
                    "detail_url": f"/client/tours/{t.pk}/",
                })
        except Exception:
            recent = []
        ctx["recent_tours"] = recent
        return ctx


class ProfilePageView(LoginRequiredMixin, TemplateView):
    template_name = "auth/profile.html"


class ClientLogoutView(View):
    def get(self, request):
        from django.contrib.auth import logout as django_logout
        django_logout(request)
        next_url = request.GET.get("next") or "/login/"
        response = redirect(next_url)
        response.delete_cookie("jwt_access")
        response.delete_cookie("jwt_refresh")
        return response

    def post(self, request):
        return self.get(request)


class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.backend = "django.contrib.auth.backends.ModelBackend"
            django_login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "success": True,
                    "message": "User Registered Successfully",
                    "user": {
                        "id": user.id,
                        "first_name": user.first_name,
                        "last_name": getattr(user, "last_name", ""),
                        "email": user.email,
                    },
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendRegistrationOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        first_name = str(request.data.get("first_name", "")).strip()
        last_name = str(request.data.get("last_name", "")).strip()
        email = str(request.data.get("email", "")).strip().lower()
        phone_number = str(request.data.get("phone_number", "")).strip()
        password = str(request.data.get("password", "")).strip()
        confirm_password = str(request.data.get("confirm_password", "")).strip()

        errors = {}
        if not first_name:
            errors["first_name"] = ["First name is required."]
        if not email:
            errors["email"] = ["Email is required."]
        if not phone_number:
            errors["phone_number"] = ["Phone number is required."]
        if not password:
            errors["password"] = ["Password is required."]
        elif len(password) < 6:
            errors["password"] = ["Password must be at least 6 characters."]
        if password != confirm_password:
            errors["confirm_password"] = ["Passwords do not match."]

        existing_user = User.objects.filter(email__iexact=email).first()
        if existing_user and existing_user.last_login is not None:
            errors["email"] = ["User with this email already exists."]
        if User.objects.filter(phone_number=phone_number).exclude(email__iexact=email).exists():
            errors["phone_number"] = ["User with this phone number already exists."]

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        otp_code = f"{random.randint(100000, 999999)}"
        email_sent = send_otp_email(email, otp_code, first_name)

        request.session["pending_registration"] = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone_number": phone_number,
            "password": password,
            "otp_code": otp_code,
            "otp_timestamp": time.time(),
            "email_sent": email_sent,
        }
        request.session.modified = True

        msg = f"6-digit verification code sent to {email}" if email_sent else f"Verification code generated for {email}"
        return Response(
            {
                "success": True,
                "message": msg,
                "email": email,
                "otp_preview": otp_code,
                "email_sent": email_sent,
                "redirect_url": "/register/verify-otp/",
            },
            status=status.HTTP_200_OK,
        )


class VerifyRegistrationOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        entered_otp = str(request.data.get("otp", "")).strip()
        pending = request.session.get("pending_registration")

        if not pending:
            return Response(
                {"detail": "No pending registration found or session expired. Please register again."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not entered_otp:
            return Response(
                {"detail": "Please enter the 6-digit OTP code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check 5-minute timeout (300 seconds)
        timestamp = pending.get("otp_timestamp", 0)
        if time.time() - timestamp > 300:
            return Response(
                {"detail": "Verification code has expired. Please click 'Resend OTP'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        stored_otp = str(pending.get("otp_code", "")).strip()
        if entered_otp != stored_otp:
            return Response(
                {"detail": "Invalid verification code. Please check and try again."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if user already exists
        existing_user = User.objects.filter(email__iexact=pending["email"]).first()
        if existing_user:
            if existing_user.last_login is not None:
                return Response(
                    {"detail": "User with this email is already registered."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # User was created as an invite placeholder! Activate and set chosen password:
            existing_user.set_password(pending["password"])
            existing_user.first_name = pending["first_name"]
            existing_user.last_name = pending.get("last_name", "")
            existing_user.phone_number = pending["phone_number"]
            existing_user.is_active = True
            existing_user.save()
            user = existing_user
        else:
            user = User.objects.create_user(
                email=pending["email"],
                password=pending["password"],
                first_name=pending["first_name"],
                last_name=pending.get("last_name", ""),
                phone_number=pending["phone_number"],
            )

        # Clear session
        if "pending_registration" in request.session:
            del request.session["pending_registration"]
            request.session.modified = True

        user.backend = "django.contrib.auth.backends.ModelBackend"
        django_login(request, user)
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "success": True,
                "message": "Account verified and registered successfully!",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                "redirect_url": "/client/dashboard/",
            },
            status=status.HTTP_201_CREATED,
        )


class ResendRegistrationOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        pending = request.session.get("pending_registration")
        if not pending:
            return Response(
                {"detail": "No pending registration found. Please register again."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_otp = f"{random.randint(100000, 999999)}"
        pending["otp_code"] = new_otp
        pending["otp_timestamp"] = time.time()
        request.session["pending_registration"] = pending
        request.session.modified = True

        email = pending["email"]
        first_name = pending.get("first_name", "User")
        email_sent = send_otp_email(email, new_otp, first_name)
        pending["email_sent"] = email_sent
        request.session["pending_registration"] = pending
        request.session.modified = True

        msg = f"A new 6-digit verification code has been sent to {email}" if email_sent else f"New verification code generated for {email}"
        return Response(
            {
                "success": True,
                "message": msg,
                "otp_code": new_otp,
                "otp_preview": new_otp,
                "email_sent": email_sent,
            },
            status=status.HTTP_200_OK,
        )



class UserLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            user.backend = "django.contrib.auth.backends.ModelBackend"
            django_login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "success": True,
                    "message": "Login Successful",
                    "user": {
                        "id": user.id,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "phone_number": user.phone_number,
                    },
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfileUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            request.user, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                UserProfileSerializer(user, context={"request": request}).data,
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        return self.patch(request)
