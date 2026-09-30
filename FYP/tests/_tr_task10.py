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
from decimal import Decimal


def header_for(user):
    tok = RefreshToken.for_user(user)
    return {"HTTP_AUTHORIZATION": "Bearer " + str(tok.access_token)}


def cleanup_user_emails(emails, phones):
    user_qs = User.objects.filter(email__in=emails) | User.objects.filter(phone_number__in=phones)
    uids = list(user_qs.values_list('id', flat=True))
    if uids:
        ExpenseSplit.objects.filter(expense__paid_by_id__in=uids).delete()
        Receipt.objects.filter(expense__paid_by_id__in=uids).delete()
        Notification.objects.filter(recipient_id__in=uids).delete()
        ExpenseLimit.objects.filter(user_id__in=uids).delete()
        ExpenseSplit.objects.filter(user_id__in=uids).delete()
        Expense.objects.filter(paid_by_id__in=uids).delete()
        TourMember.objects.filter(user_id__in=uids).delete()
        Tour.objects.filter(created_by_id__in=uids).delete()
        user_qs.delete()


def run():
    fail = 0
    emailA = "user_tr10A@example.com"
    emailB = "user_tr10B@example.com"
    emailC = "user_tr10C@example.com"
    emailO = "user_tr10O@example.com"
    emailX = "user_tr10X@example.com"
    emailY = "user_tr10Y@example.com"
    phoneA = "+923000999101"
    phoneB = "+923000999102"
    phoneC = "+923000999103"
    phoneO = "+923000999104"
    phoneX = "+923000999105"
    phoneY = "+923000999106"

    cleanup_user_emails(
        [emailA, emailB, emailC, emailO, emailX, emailY],
        [phoneA, phoneB, phoneC, phoneO, phoneX, phoneY],
    )

    uA = User.objects.create_user(email=emailA, first_name="Ali", last_name="Ahmed", phone_number=phoneA, password="Pass123!ok")
    uB = User.objects.create_user(email=emailB, first_name="Bilal", last_name="Butt", phone_number=phoneB, password="Pass123!ok")
    uC = User.objects.create_user(email=emailC, first_name="Chaud", last_name="Cheema", phone_number=phoneC, password="Pass123!ok")
    uO = User.objects.create_user(email=emailO, first_name="Outsider", last_name="O", phone_number=phoneO, password="Pass123!ok")

    TourMember.objects.filter(tour__title__startswith="TR-10").delete()
    Tour.objects.filter(title__startswith="TR-10").delete()
    Notification.objects.filter(recipient__in=[uA, uB, uC, uO]).delete()

    client = APIClient()
    hdrA = header_for(uA)
    hdrB = header_for(uB)
    hdrO = header_for(uO)

    tour = Tour.objects.create(
        title="TR-10 settlement tour", destination="Islamabad", budget=2000,
        start_date=_date(2026, 11, 1), end_date=_date(2026, 11, 5), created_by=uA,
    )
    TourMember.objects.get_or_create(tour=tour, user=uA, defaults={"role": "creator"})
    TourMember.objects.get_or_create(tour=tour, user=uB, defaults={"role": "member"})
    TourMember.objects.get_or_create(tour=tour, user=uC, defaults={"role": "member"})

    # TR-10.1: uA creates expense $300 food, paid_by=uA, split equal among A,B,C
    e1_body = {
        "tour_id": tour.pk, "title": "Big Dinner", "amount": "300.00",
        "category": "food", "payment_method": "card",
        "paid_by": uA.id, "split_members": [uA.id, uB.id, uC.id],
    }
    r1 = client.post("/client/expenses/api/create/", data=e1_body, format="json", **hdrA)
    print("[TR-10.1] create $300 expense status=" + str(r1.status_code))
    try:
        assert r1.status_code == 201, "expense create status=" + str(r1.status_code)
        print("[TR-10.1 PASS] expense created")
    except AssertionError as e:
        fail += 1
        print("[TR-10.1 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    # TR-10.2: GET settlement API as uB (member), assertions on known balances
    r_settle = client.get("/client/tours/api/" + str(tour.pk) + "/settlement/", **hdrB)
    print("[TR-10.2] GET settlement (uB member) status=" + str(r_settle.status_code))
    try:
        assert r_settle.status_code == 200, "settlement status=" + str(r_settle.status_code)
        sd = r_settle.json()
        total_exp = float(sd.get("total_expenses") or 0)
        total_members = int(sd.get("total_members") or 0)
        print("  total_expenses=" + str(total_exp) + " total_members=" + str(total_members))
        assert abs(total_exp - 300.00) < 0.005, "total_expenses != 300: " + str(total_exp)
        assert total_members == 3, "total_members != 3: " + str(total_members)

        per_member = sd.get("per_member") or []
        assert len(per_member) == 3, "per_member len != 3: " + str(len(per_member))

        by_id = {}
        for m in per_member:
            by_id[m.get("user_id")] = m

        mA = by_id.get(uA.id)
        mB = by_id.get(uB.id)
        mC = by_id.get(uC.id)
        assert mA is not None and mB is not None and mC is not None, "missing member entries in per_member"

        nbA = float(mA.get("net_balance") or 0)
        nbB = float(mB.get("net_balance") or 0)
        nbC = float(mC.get("net_balance") or 0)
        print("  net_balances: A=" + str(nbA) + " B=" + str(nbB) + " C=" + str(nbC))
        print("  roles: A=" + str(mA.get("role")) + " B=" + str(mB.get("role")) + " C=" + str(mC.get("role")))
        assert abs(nbA - 200.00) < 0.005, "A net_balance != +200: " + str(nbA)
        assert abs(nbB - (-100.00)) < 0.005, "B net_balance != -100: " + str(nbB)
        assert abs(nbC - (-100.00)) < 0.005, "C net_balance != -100: " + str(nbC)
        assert mA.get("role") == "creditor", "A role not creditor: " + str(mA.get("role"))
        assert mB.get("role") == "debtor", "B role not debtor: " + str(mB.get("role"))
        assert mC.get("role") == "debtor", "C role not debtor: " + str(mC.get("role"))

        transfers = sd.get("transfers") or []
        print("  transfers count=" + str(len(transfers)))
        for t in transfers:
            print("    from=" + str(t.get("from_user_id")) + " to=" + str(t.get("to_user_id")) + " amt=" + str(t.get("amount")))

        assert len(transfers) >= 1, "no transfers produced"

        sum_transfers = 0.0
        for t in transfers:
            sum_transfers += float(t.get("amount") or 0)
        print("  sum(transfer.amount)=" + str(sum_transfers))
        assert abs(sum_transfers - 200.00) < 0.005, "sum transfers != 200: " + str(sum_transfers)

        from_ids = set()
        to_ids = set()
        for t in transfers:
            from_ids.add(t.get("from_user_id"))
            to_ids.add(t.get("to_user_id"))
        assert uB.id in from_ids and uC.id in from_ids, "B and C must be from (debtors): from_ids=" + str(from_ids)
        assert uA.id in to_ids, "A must be to (creditor): to_ids=" + str(to_ids)
        assert len(to_ids) == 1, "only A should receive: to_ids=" + str(to_ids)

        if len(transfers) == 2:
            print("  (exactly 2 transfers: B->A 100, C->A 100)")

        summ = sd.get("summary") or {}
        total_paid = float(summ.get("total_paid") or 0)
        total_shares = float(summ.get("total_shares") or 0)
        net_zero = float(summ.get("net_zero_difference") or 0)
        print("  summary: total_paid=" + str(total_paid) + " total_shares=" + str(total_shares) + " net_zero=" + str(net_zero))
        assert abs(total_paid - 300.00) < 0.005, "total_paid != 300: " + str(total_paid)
        assert abs(total_shares - 300.00) < 0.005, "total_shares != 300: " + str(total_shares)
        assert abs(net_zero) < 0.01, "net_zero_difference >= 0.01: " + str(net_zero)

        print("[TR-10.2 PASS] 3-user balances match; transfers sum to 200; invariants OK")
    except AssertionError as e:
        fail += 1
        print("[TR-10.2 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    # TR-10.3: Outsider uO GET settlement -> 403
    r_out = client.get("/client/tours/api/" + str(tour.pk) + "/settlement/", **hdrO)
    print("[TR-10.3] outsider GET settlement status=" + str(r_out.status_code))
    try:
        assert r_out.status_code == 403, "outsider expected 403 got " + str(r_out.status_code)
        print("[TR-10.3 PASS] outsider blocked with 403")
    except AssertionError as e:
        fail += 1
        print("[TR-10.3 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    # TR-10.4: 2-user simple case: uX pays 100 split 50-50 with uY -> Y->X 50.00 1 transfer
    print()
    uX = User.objects.create_user(email=emailX, first_name="Xee", last_name="Xen", phone_number=phoneX, password="Pass123!ok")
    uY = User.objects.create_user(email=emailY, first_name="Yusuf", last_name="Yousaf", phone_number=phoneY, password="Pass123!ok")
    tour2 = Tour.objects.create(
        title="TR-10 2-user settle", destination="Murree", budget=500,
        start_date=_date(2026, 10, 1), end_date=_date(2026, 10, 2), created_by=uX,
    )
    TourMember.objects.get_or_create(tour=tour2, user=uX, defaults={"role": "creator"})
    TourMember.objects.get_or_create(tour=tour2, user=uY, defaults={"role": "member"})
    hdrX = header_for(uX)

    e2_body = {
        "tour_id": tour2.pk, "title": "Coffee Run", "amount": "100.00",
        "category": "food", "payment_method": "cash",
        "paid_by": uX.id, "split_members": [uX.id, uY.id],
    }
    client.post("/client/expenses/api/create/", data=e2_body, format="json", **hdrX)
    r_s2 = client.get("/client/tours/api/" + str(tour2.pk) + "/settlement/", **hdrX)
    print("[TR-10.4] 2-user settlement status=" + str(r_s2.status_code))
    try:
        assert r_s2.status_code == 200, "2user status=" + str(r_s2.status_code)
        s2d = r_s2.json()
        transfers2 = s2d.get("transfers") or []
        per2 = s2d.get("per_member") or []
        by_id2 = {}
        for m in per2:
            by_id2[m.get("user_id")] = m
        mX = by_id2.get(uX.id)
        mY = by_id2.get(uY.id)
        print("  2user: X.net=" + str(mX.get("net_balance") if mX else None) + " Y.net=" + str(mY.get("net_balance") if mY else None))
        print("  2user transfer count=" + str(len(transfers2)))
        for t in transfers2:
            print("    from=" + str(t.get("from_user_id")) + " to=" + str(t.get("to_user_id")) + " amt=" + str(t.get("amount")))
        assert len(transfers2) == 1, "2user expected exactly 1 transfer, got " + str(len(transfers2))
        t2 = transfers2[0]
        assert t2.get("from_user_id") == uY.id, "from not Y"
        assert t2.get("to_user_id") == uX.id, "to not X"
        assert abs(float(t2.get("amount") or 0) - 50.00) < 0.005, "amount not 50: " + str(t2.get("amount"))
        print("[TR-10.4 PASS] 2-user case: Y pays X exactly $50.00")
    except AssertionError as e:
        fail += 1
        print("[TR-10.4 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    # TR-10.5: Settlement template page GET as member returns 200
    # LoginRequiredMixin uses Django session (not DRF JWT), so force_login for the page request
    page_client = APIClient()
    page_client.force_login(uA)
    r_page = page_client.get("/client/tours/" + str(tour.pk) + "/settlement/")
    print()
    print("[TR-10.5] GET settlement page HTML status=" + str(r_page.status_code))
    try:
        assert r_page.status_code == 200, "page status=" + str(r_page.status_code)
        html_text = ""
        if hasattr(r_page, "content"):
            html_text = r_page.content.decode("utf-8", errors="ignore")
        if not html_text and hasattr(r_page, "streaming_content"):
            html_bytes = b""
            for c in r_page.streaming_content:
                html_bytes += (c if isinstance(c, (bytes, bytearray)) else str(c).encode("utf-8", errors="ignore"))
            html_text = html_bytes.decode("utf-8", errors="ignore")
        assert "Settlement" in html_text, "page missing Settlement heading"
        assert "Suggested Transfers" in html_text, "page missing Suggested Transfers section"
        assert ("__PT_TOUR_ID__") in html_text, "page missing __PT_TOUR_ID__ script injection"
        print("[TR-10.5 PASS] settlement page renders with expected structure")
    except AssertionError as e:
        fail += 1
        print("[TR-10.5 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    print()
    if fail == 0:
        print("=== TASK 10 ALL TR PASS (" + str(5) + " scenarios) ===")
        sys.exit(0)
    else:
        print("=== TASK 10 TR FAIL: " + str(fail) + " assertions ===")
        sys.exit(1)


if __name__ == "__main__":
    run()
