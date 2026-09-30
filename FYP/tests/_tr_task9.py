import os, sys, django
sys.path.insert(0, r"c:\Users\muham\Downloads\FYP (1)\FYP")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.test.utils import setup_test_environment
setup_test_environment()

from datetime import date as _date
from apps.accounts.models import User
from apps.tours.models import Tour, TourMember
from apps.expenses.models import Expense, ExpenseSplit, Receipt, ExpenseLimit
from apps.notifications.models import Notification
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


def header_for(user):
    tok = RefreshToken.for_user(user)
    return {"HTTP_AUTHORIZATION": "Bearer " + str(tok.access_token)}


def cleanup_user_emails(emails, phones):
    # Pre-cleanup anything PROTECT-referencing these users
    user_qs = User.objects.filter(email__in=emails) | User.objects.filter(phone_number__in=phones)
    uids = list(user_qs.values_list('id', flat=True))
    if uids:
        # remove Expense referencing these users via paid_by PROTECT
        ExpenseSplit.objects.filter(expense__paid_by_id__in=uids).delete()
        Receipt.objects.filter(expense__paid_by_id__in=uids).delete()
        # notifications referencing users as recipient no PROTECT
        Notification.objects.filter(recipient_id__in=uids).delete()
        # remove expense limits referencing
        ExpenseLimit.objects.filter(user_id__in=uids).delete()
        # Now remove expenses that reference PROTECT paid_by
        Expense.objects.filter(paid_by_id__in=uids).delete()
        # Tour member / tour creator references
        TourMember.objects.filter(user_id__in=uids).delete()
        # Notifications might tour=... cascade from tour delete below
        Tour.objects.filter(created_by_id__in=uids).delete()
        user_qs.delete()


def run():
    fail = 0
    emailA = "user_tr9A@example.com"
    emailB = "user_tr9B@example.com"
    emailC = "user_tr9C@example.com"
    emailD = "user_tr9D@example.com"
    phoneA = "+923000999001"
    phoneB = "+923000999002"
    phoneC = "+923000999003"
    phoneD = "+923000999004"

    cleanup_user_emails(
        [emailA, emailB, emailC, emailD],
        [phoneA, phoneB, phoneC, phoneD],
    )

    uA = User.objects.create_user(email=emailA, first_name="Amir", last_name="Ak", phone_number=phoneA, password="Pass123!ok")
    uB = User.objects.create_user(email=emailB, first_name="Baber", last_name="Bhatti", phone_number=phoneB, password="Pass123!ok")
    uC = User.objects.create_user(email=emailC, first_name="C", last_name="Chan", phone_number=phoneC, password="Pass123!ok")
    uD = User.objects.create_user(email=emailD, first_name="D", last_name="Dani", phone_number=phoneD, password="Pass123!ok")

    # Remove any leftover TR-9 tours or notifications
    TourMember.objects.filter(tour__title__startswith="TR-9").delete()
    Tour.objects.filter(title__startswith="TR-9").delete()
    Notification.objects.filter(recipient__in=[uA, uB, uC, uD]).delete()

    client = APIClient()
    hdrA = header_for(uA)
    hdrB = header_for(uB)
    hdrD = header_for(uD)

    tour = Tour.objects.create(
        title="TR-9 notif hook test", destination="Lahore", budget=5000,
        start_date=_date(2026, 12, 1), end_date=_date(2026, 12, 5), created_by=uA,
    )
    TourMember.objects.get_or_create(tour=tour, user=uA, defaults={"role": "creator"})
    TourMember.objects.get_or_create(tour=tour, user=uB, defaults={"role": "member"})
    TourMember.objects.get_or_create(tour=tour, user=uC, defaults={"role": "member"})

    # TR-9.1 uA creates expense paid_by=uA: B and C each get 1 new_expense notif (2 total)
    notif_before = Notification.objects.count()
    e1_body = {
        "tour_id": tour.pk, "title": "Dinner", "amount": "80.00",
        "category": "food", "payment_method": "cash",
        "paid_by": uA.id, "split_members": [uA.id, uB.id, uC.id],
    }
    r = client.post("/client/expenses/api/create/", data=e1_body, format="json", **hdrA)
    print("[TR-9.1] create expense status=" + str(r.status_code))
    try:
        assert r.status_code == 201, "status=" + str(r.status_code)
        after = Notification.objects.count()
        new_total = after - notif_before
        b_count = Notification.objects.filter(recipient=uB, type="new_expense").count()
        c_count = Notification.objects.filter(recipient=uC, type="new_expense").count()
        a_count = Notification.objects.filter(recipient=uA, type="new_expense").count()
        print("  new notifications: " + str(new_total) + " | B=" + str(b_count) + ", C=" + str(c_count) + ", A=" + str(a_count))
        assert b_count == 1 and c_count == 1 and a_count == 0, "unexpected new_expense notification counts per user"
        print("[TR-9.1 PASS] 2 new_expense notifications (B+C); creator/paid_by A excluded")
    except AssertionError as e:
        fail += 1
        print("[TR-9.1 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    # TR-9.2 uD joins via join_token POST => A,B,C each get 1 member_joined (3 total). D gets 0.
    nj_before = Notification.objects.filter(type="member_joined").count()
    r_join = client.post("/client/tours/api/join/" + str(tour.join_token) + "/", data={"join_token": ""}, format="json", **hdrD)
    print("[TR-9.2] join status=" + str(r_join.status_code))
    try:
        assert r_join.status_code in (200, 201), "join status=" + str(r_join.status_code)
        jd = r_join.json()
        assert jd.get("already_member") is False
        nj_after = Notification.objects.filter(type="member_joined").count()
        print("  member_joined notifs: " + str(nj_before) + " -> " + str(nj_after) + " (expected +3)")
        assert nj_after == nj_before + 3, "member_joined count not +3: " + str(nj_before) + " -> " + str(nj_after)
        a_count = Notification.objects.filter(recipient=uA, type="member_joined").count()
        b_count = Notification.objects.filter(recipient=uB, type="member_joined").count()
        c_count = Notification.objects.filter(recipient=uC, type="member_joined").count()
        d_count = Notification.objects.filter(recipient=uD, type="member_joined").count()
        assert a_count == 1 and b_count == 1 and c_count == 1 and d_count == 0, (
            "member_joined per user wrong: A" + str(a_count) + " B" + str(b_count) + " C" + str(c_count) + " D" + str(d_count)
        )
        print("[TR-9.2 PASS] uD join A,B,C each 1 member_joined notification; D gets 0")
    except AssertionError as e:
        fail += 1
        print("[TR-9.2 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    # TR-9.3 uB GET list -> total_unread = 2 (1 new_expense + 1 member_joined)
    r_list = client.get("/client/notifications/api/?unread_only=false&limit=20", **hdrB)
    print("[TR-9.3] list status=" + str(r_list.status_code))
    try:
        assert r_list.status_code == 200, "status=" + str(r_list.status_code)
        d = r_list.json()
        total_unread = int(d.get("total_unread") or 0)
        count = int(d.get("count") or 0)
        print("  total_unread=" + str(total_unread) + " count=" + str(count))
        assert total_unread == 2, "uB total_unread != 2 -> " + str(total_unread)
        assert count == 2, "uB items count != 2 -> " + str(count)
        types = sorted([(x.get("type") or "") for x in d.get("items") or []])
        assert types == sorted(["new_expense", "member_joined"]), "types unexpected: " + str(types)
        print("[TR-9.3 PASS] uB list returns " + str(total_unread) + " unread, types=" + str(types))
    except AssertionError as e:
        fail += 1
        print("[TR-9.3 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    # TR-9.4 count for B
    r_count = client.get("/client/notifications/api/count/", **hdrB)
    try:
        assert r_count.status_code == 200
        d = r_count.json()
        assert int(d.get("unread") or 0) == 2, "count unread != 2 -> " + str(d)
        assert int(d.get("total") or 0) == 2, "count total != 2 -> " + str(d)
        print("[TR-9.4 PASS] count API unread=2 total=2")
    except AssertionError as e:
        fail += 1
        print("[TR-9.4 FAIL] " + str(e))

    # TR-9.5 Mark-all for B -> marked=2 then count unread 0
    r_mark = client.post("/client/notifications/api/mark-read/", data={"all": True}, format="json", **hdrB)
    print("[TR-9.5] mark-all status=" + str(r_mark.status_code))
    try:
        assert r_mark.status_code == 200, "mark status=" + str(r_mark.status_code)
        d = r_mark.json()
        assert int(d.get("marked") or 0) == 2, "marked != 2 -> " + str(d)
        assert int(d.get("unread") or 0) == 0, "post-mark unread != 0 -> " + str(d)
        r_count2 = client.get("/client/notifications/api/count/", **hdrB)
        assert r_count2.status_code == 200, "post-mark count endpoint not 200"
        jc = r_count2.json()
        unread_after = int(jc.get("unread") if jc.get("unread") is not None else -1)
        assert unread_after == 0, "after mark unread not 0 -> " + str(jc)
        print("[TR-9.5 PASS] mark-all marked=" + str(d.get("marked")) + " post unread=" + str(d.get("unread")))
    except AssertionError as e:
        fail += 1
        print("[TR-9.5 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    # TR-9.6 Mark ids for C: mark 1 of 2.
    hdrC = header_for(uC)
    c_resp = client.get("/client/notifications/api/?limit=10", **hdrC)
    c_items = (c_resp.json() or {}).get("items") or []
    ids_uc = [x["id"] for x in c_items]
    print("[TR-9.6] uC ids=" + str(ids_uc))
    assert len(ids_uc) >= 2
    one_id = ids_uc[0]
    r_mark_ids = client.post("/client/notifications/api/mark-read/", data={"ids": [one_id]}, format="json", **hdrC)
    try:
        assert r_mark_ids.status_code == 200
        d = r_mark_ids.json()
        assert int(d.get("marked") or 0) == 1, "ids mark != 1 -> " + str(d)
        assert int(d.get("unread") or 0) == 1, "ids post unread != 1 -> " + str(d)
        print("[TR-9.6 PASS] mark ids=[" + str(one_id) + "] -> marked=1 unread remains=1")
    except AssertionError as e:
        fail += 1
        print("[TR-9.6 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    # cleanup
    Notification.objects.filter(recipient__in=[uA, uB, uC, uD]).delete()
    ExpenseSplit.objects.filter(expense__tour=tour).delete()
    Expense.objects.filter(tour=tour).delete()
    TourMember.objects.filter(tour=tour).delete()
    Tour.objects.filter(pk=tour.pk).delete()
    User.objects.filter(pk__in=[uA.pk, uB.pk, uC.pk, uD.pk]).delete()

    if fail == 0:
        print("=== TASK 9 ALL TR PASS ===")
        sys.exit(0)
    else:
        print("=== TASK 9 FAILURES: " + str(fail) + " ===")
        sys.exit(1)


if __name__ == "__main__":
    run()
