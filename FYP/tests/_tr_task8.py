import os, sys, django
sys.path.insert(0, r"c:\Users\muham\Downloads\FYP (1)\FYP")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.test.utils import setup_test_environment
setup_test_environment()

from datetime import datetime, timezone as tz
from decimal import Decimal
from apps.accounts.models import User
from apps.tours.models import Tour, TourMember
from apps.expenses.models import Expense, ExpenseSplit, ExpenseLimit
from apps.notifications.models import Notification
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


def header_for(user):
    tok = RefreshToken.for_user(user)
    return {"HTTP_AUTHORIZATION": f"Bearer {tok.access_token}"}


def run():
    fail = 0
    email = "user_tr8_a@example.com"
    email2 = "user_tr8_b@example.com"
    email3 = "user_tr8_c@example.com"  # outsider
    phone = "+923000888001"
    phone2 = "+923000888002"
    phone3 = "+923000888003"
    User.objects.filter(email__in=[email, email2, email3]).delete()
    User.objects.filter(phone_number__in=[phone, phone2, phone3]).delete()

    u = User.objects.create_user(email=email, first_name="Ali", last_name="Ahmed", phone_number=phone, password="Pass123!ok")
    u2 = User.objects.create_user(email=email2, first_name="Bilal", last_name="Butt", phone_number=phone2, password="Pass123!ok")
    u3 = User.objects.create_user(email=email3, first_name="C", last_name="Outsider", phone_number=phone3, password="Pass123!ok")

    TourMember.objects.filter(tour__title__startswith="TR-8").delete()
    Tour.objects.filter(title__startswith="TR-8").delete()
    ExpenseLimit.objects.filter(user__in=[u, u2, u3]).delete()
    Notification.objects.filter(recipient__in=[u, u2, u3], type='limit_exceeded').delete()

    client = APIClient()
    hdr = header_for(u)
    hdr_out = header_for(u3)

    tour = Tour.objects.create(
        title="TR-8 limit test", destination="Multan", budget=5000,
        start_date=__import__("datetime").date(2026, 11, 1),
        end_date=__import__("datetime").date(2026, 11, 5), created_by=u,
    )
    TourMember.objects.get_or_create(tour=tour, user=u, defaults={"role": "creator"})
    TourMember.objects.get_or_create(tour=tour, user=u2, defaults={"role": "member"})

    # TR-8.1 GET nonexistent limit returns null body with 200 (id:None, amount:None)
    r = client.get(f"/client/expenses/api/limits/?tour_id={tour.pk}", **hdr)
    print(f"[TR-8.1] GET limit initial status={r.status_code}")
    try:
        assert r.status_code == 200, f"status={r.status_code}"
        d = r.json()
        assert d.get('id') is None, f"id not None: {d.get('id')}"
        assert d.get('amount') is None, f"amount not None: {d.get('amount')}"
        assert d.get('total_spent') == 0.0, f"total_spent not 0: {d.get('total_spent')}"
        assert d.get('limit_exceeded') is False
        print(f"[TR-8.1 PASS] initial limit body: {d}")
    except AssertionError as e:
        fail += 1
        print(f"[TR-8.1 FAIL] {e}")

    # TR-8.2 outsider 403 on PUT
    r2 = client.put("/client/expenses/api/limits/", data={"tour_id": tour.pk, "amount": "100.00"}, format="json", **hdr_out)
    try:
        assert r2.status_code == 403, f"outsider PUT not 403: {r2.status_code}"
        print("[TR-8.2 PASS] outsider PUT limit -> 403")
    except AssertionError as e:
        fail += 1
        print(f"[TR-8.2 FAIL] {e}")

    # TR-8.3 PUT create limit $200.00 for user u
    r3 = client.put("/client/expenses/api/limits/", data={"tour_id": tour.pk, "amount": "200.00"}, format="json", **hdr)
    print(f"[TR-8.3] PUT create limit status={r3.status_code}")
    try:
        assert r3.status_code == 201, f"status={r3.status_code}"
        d = r3.json()
        assert d.get('amount') == 200.0, f"amount not 200.0 -> {d.get('amount')}"
        assert d.get('limit_exceeded') is False
        assert d.get('last_notified_exceeded') is False
        print(f"[TR-8.3 PASS] created body: {d}")
    except AssertionError as e:
        fail += 1
        print(f"[TR-8.3 FAIL] {e}")

    # TR-8.4 PUT upsert same $200 second time -> 200
    r4 = client.put("/client/expenses/api/limits/", data={"tour_id": tour.pk, "amount": "200.00"}, format="json", **hdr)
    try:
        assert r4.status_code == 200, f"upsert not 200 -> {r4.status_code}"
        print("[TR-8.4 PASS] PUT same -> 200 (no create)")
    except AssertionError as e:
        fail += 1
        print(f"[TR-8.4 FAIL] {e}")

    # TR-8.5 add expense $150 paid by u, not exceed limit (200) -> response alerts.actor.limit_exceeded=false, no new limit_exceeded notification
    Notification.objects.filter(recipient=u, type='limit_exceeded').delete()
    e1_body = {
        "tour_id": tour.pk, "title": "Meal 1", "amount": "150.00",
        "category": "food", "payment_method": "cash",
        "paid_by": u.id, "split_members": [u.id, u2.id],
    }
    r5 = client.post("/client/expenses/api/create/", data=e1_body, format="json", **hdr)
    print(f"[TR-8.5] expense 150 status={r5.status_code}")
    try:
        assert r5.status_code == 201, f"status={r5.status_code}, body={r5.content[:200]}"
        d = r5.json()
        alerts = d.get('alerts', {}) or {}
        actor = alerts.get('actor', {}) or {}
        assert actor.get('limit_exceeded') is False, f"actor.limit_exceeded=true -> {actor}"
        assert actor.get('just_crossed') in (False, None)
        assert Notification.objects.filter(recipient=u, type='limit_exceeded').count() == 0, "unexpected limit_exceeded notification"
        print(f"[TR-8.5 PASS] alerts actor={actor} notifications=0")
    except AssertionError as e:
        fail += 1
        print(f"[TR-8.5 FAIL] {e}")
        import traceback; traceback.print_exc()

    # TR-8.6 add second expense $100 paid by u -> total 250 > 200 => alerts.actor.limit_exceeded=true + just_crossed=true + EXACTLY ONE notification type=limit_exceeded
    Notification.objects.filter(recipient=u, type='limit_exceeded').delete()
    e2_body = {
        "tour_id": tour.pk, "title": "Taxi ride", "amount": "100.00",
        "category": "transport", "payment_method": "cash",
        "paid_by": u.id, "split_members": [u.id, u2.id],
    }
    r6 = client.post("/client/expenses/api/create/", data=e2_body, format="json", **hdr)
    print(f"[TR-8.6] second expense 100 status={r6.status_code}")
    try:
        assert r6.status_code == 201, f"status={r6.status_code}, body={r6.content[:200]}"
        d = r6.json()
        alerts = d.get('alerts', {}) or {}
        actor = alerts.get('actor', {}) or {}
        paid_by = alerts.get('paid_by', {}) or {}
        assert actor.get('limit_exceeded') is True, f"actor not exceeded: {actor}"
        assert actor.get('just_crossed') is True, f"actor not just_crossed: {actor}"
        assert paid_by.get('limit_exceeded') is True, f"paid_by not exceeded: {paid_by}"
        assert paid_by.get('just_crossed') is True, f"paid_by not just_crossed: {paid_by}"
        notifs_count = Notification.objects.filter(recipient=u, type='limit_exceeded').count()
        assert notifs_count == 1, f"expected exactly 1 limit_exceeded notification, got {notifs_count}"
        n = Notification.objects.filter(recipient=u, type='limit_exceeded').order_by('-created_at').first()
        print(f"[TR-8.6 PASS] alerts actor={actor}; notifications={notifs_count}; title={n.title if n else None}")
    except AssertionError as e:
        fail += 1
        print(f"[TR-8.6 FAIL] {e}")
        import traceback; traceback.print_exc()

    # TR-8.7 add third expense $50 paid by u -> still exceeded BUT NOT NEW notification (just_crossed=False, notification count remains 1)
    prev_notif_count = Notification.objects.filter(recipient=u, type='limit_exceeded').count()
    e3_body = {
        "tour_id": tour.pk, "title": "Snacks", "amount": "50.00",
        "category": "food", "payment_method": "card",
        "paid_by": u.id, "split_members": [u.id, u2.id],
    }
    r7 = client.post("/client/expenses/api/create/", data=e3_body, format="json", **hdr)
    print(f"[TR-8.7] third expense status={r7.status_code}")
    try:
        assert r7.status_code == 201, f"status={r7.status_code}"
        d = r7.json()
        actor = (d.get('alerts') or {}).get('actor') or {}
        assert actor.get('limit_exceeded') is True, f"not exceeded: {actor}"
        assert actor.get('just_crossed') is False, f"just_crossed should be false on repeat exceed: {actor}"
        new_count = Notification.objects.filter(recipient=u, type='limit_exceeded').count()
        assert new_count == prev_notif_count, f"notification count increased {prev_notif_count} -> {new_count}: expected no new notification after already-exceeded state"
        # GET limits confirms exceeded=true
        r_lim = client.get(f"/client/expenses/api/limits/?tour_id={tour.pk}", **hdr)
        assert r_lim.status_code == 200
        dlim = r_lim.json()
        assert dlim.get('limit_exceeded') is True
        assert abs(float(dlim.get('total_spent') or 0) - 300.0) < 0.01, f"total_spent not 300: {dlim.get('total_spent')}"
        assert abs(float(dlim.get('remaining') or 0) - (-100.0)) < 0.01, f"remaining not -100: {dlim.get('remaining')}"
        assert dlim.get('last_notified_exceeded') is True, f"last_notified_exceeded not true: {dlim}"
        print(f"[TR-8.7 PASS] alerts actor={actor}; notification count remains {new_count}; GET limit={dlim}")
    except AssertionError as e:
        fail += 1
        print(f"[TR-8.7 FAIL] {e}")
        import traceback; traceback.print_exc()

    # TR-8.8 user raises limit to 500 (raises amount > old_amount) -> last_notified_exceeded cleared to False (cleared by helper -> reset to False because now within). Verify clear.
    r8 = client.put("/client/expenses/api/limits/", data={"tour_id": tour.pk, "amount": "500.00"}, format="json", **hdr)
    print(f"[TR-8.8] raise limit to 500 status={r8.status_code}")
    try:
        assert r8.status_code == 200, f"status={r8.status_code}"
        d = r8.json()
        assert d.get('limit_exceeded') is False, f"should not be exceeded now: {d}"
        assert d.get('last_notified_exceeded') is False, f"last_notified should be reset after raise + within limit: {d}"
        assert abs(float(d.get('remaining') or 0) - 200.0) < 0.01, f"remaining not 200: {d}"
        print(f"[TR-8.8 PASS] raised limit body: {d}")
    except AssertionError as e:
        fail += 1
        print(f"[TR-8.8 FAIL] {e}")

    # TR-8.9 add $250 paid by u after raise -> total 550 > 500: crossed again, new notification fires because flag was cleared.
    prev_notif_count = Notification.objects.filter(recipient=u, type='limit_exceeded').count()
    e4_body = {
        "tour_id": tour.pk, "title": "Hotel stay", "amount": "250.00",
        "category": "accommodation", "payment_method": "online_transfer",
        "paid_by": u.id, "split_members": [u.id, u2.id],
    }
    r9 = client.post("/client/expenses/api/create/", data=e4_body, format="json", **hdr)
    print(f"[TR-8.9] post-raise exceed status={r9.status_code}")
    try:
        assert r9.status_code == 201, f"status={r9.status_code}"
        d = r9.json()
        actor = (d.get('alerts') or {}).get('actor') or {}
        assert actor.get('just_crossed') is True, f"just_crossed should be true after flag cleared: {actor}"
        new_count = Notification.objects.filter(recipient=u, type='limit_exceeded').count()
        assert new_count == prev_notif_count + 1, f"expected +1 notification after re-cross: {prev_notif_count} -> {new_count}"
        print(f"[TR-8.9 PASS] alerts actor={actor}; notifications {prev_notif_count} -> {new_count}")
    except AssertionError as e:
        fail += 1
        print(f"[TR-8.9 FAIL] {e}")
        import traceback; traceback.print_exc()

    # cleanup
    Notification.objects.filter(recipient__in=[u, u2, u3]).delete()
    ExpenseSplit.objects.filter(expense__tour=tour).delete()
    Expense.objects.filter(tour=tour).delete()
    ExpenseLimit.objects.filter(user__in=[u, u2]).delete()
    TourMember.objects.filter(tour=tour).delete()
    Tour.objects.filter(pk=tour.pk).delete()
    User.objects.filter(pk__in=[u.pk, u2.pk, u3.pk]).delete()

    if fail == 0:
        print("=== TASK 8 ALL TR PASS ===")
        sys.exit(0)
    else:
        print(f"=== TASK 8 FAILURES: {fail} ===")
        sys.exit(1)


if __name__ == "__main__":
    run()
