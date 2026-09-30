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
    emailA = "user_tr12A@example.com"
    emailB = "user_tr12B@example.com"
    emailO = "user_tr12O@example.com"
    phoneA = "+923000999211"
    phoneB = "+923000999212"
    phoneO = "+923000999213"

    cleanup_user_emails(
        [emailA, emailB, emailO],
        [phoneA, phoneB, phoneO],
    )

    uA = User.objects.create_user(email=emailA, first_name="Ali", last_name="Ahmed", phone_number=phoneA, password="Pass123!ok")
    uB = User.objects.create_user(email=emailB, first_name="Babar", last_name="B", phone_number=phoneB, password="Pass123!ok")
    uO = User.objects.create_user(email=emailO, first_name="Outsider", last_name="O", phone_number=phoneO, password="Pass123!ok")

    TourMember.objects.filter(tour__title__startswith="TR-12").delete()
    Tour.objects.filter(title__startswith="TR-12").delete()
    Expense.objects.filter(title__startswith="TR-12").delete()

    clientA = APIClient()
    clientO = APIClient()
    hdrA = header_for(uA)
    hdrO = header_for(uO)

    tour = Tour.objects.create(
        title="TR-12 offline sync tour", destination="Lahore", budget=3000,
        start_date=_date(2026, 9, 10), end_date=_date(2026, 9, 14), created_by=uA,
    )
    TourMember.objects.get_or_create(tour=tour, user=uA, defaults={"role": "creator"})
    TourMember.objects.get_or_create(tour=tour, user=uB, defaults={"role": "member"})
    tid = tour.pk

    SYNC_URL = "/client/api/offline/sync-expenses/"

    # ------------------------------------------------------------------
    # TR-12.1 Batch with 1 valid item (Food $25 equal split) + 1 invalid (amount=-100)
    # Expected: HTTP 200, ok_count=1, error_count=1, results.len=2
    #   item0: status=ok, expense_id not null, amount=$25, category=food
    #   item1: status=error, error dict contains "amount" key
    # ------------------------------------------------------------------
    valid_payload = {
        "tour_id": tid,
        "title": "TR-12 lunch valid",
        "notes": "TR-12 valid offline sync item",
        "amount": "25.00",
        "category": "food",
        "payment_method": "cash",
        "paid_by": uA.pk,
        "split_members": [uA.pk, uB.pk],
    }
    invalid_payload = {
        "tour_id": tid,
        "title": "TR-12 bad negative",
        "amount": "-100.00",
        "category": "transport",
        "payment_method": "card",
        "paid_by": uA.pk,
        "split_members": [uA.pk, uB.pk],
    }

    batch_body = {
        "pending": [
            {"client_id": "cid_valid_001", "payload": valid_payload},
            {"client_id": "cid_invalid_002", "payload": invalid_payload},
        ]
    }

    resp = clientA.post(SYNC_URL, data=batch_body, format="json", **hdrA)
    try:
        assert resp.status_code == 200, f"TR-12.1 expected 200 got {resp.status_code} body={resp.content[:400]}"
        data = resp.json()
        results = data.get("results") or []
        assert isinstance(results, list) and len(results) == 2, f"TR-12.1 expected 2 results got len={len(results)}"
        assert data.get("ok_count") == 1, f"TR-12.1 ok_count expected 1 got {data.get('ok_count')}"
        assert data.get("error_count") == 1, f"TR-12.1 error_count expected 1 got {data.get('error_count')}"
        assert data.get("total") == 2, f"TR-12.1 total expected 2 got {data.get('total')}"

        # Find valid/invalid by client_id
        by_cid = {r.get("client_id"): r for r in results}
        ok_res = by_cid.get("cid_valid_001")
        err_res = by_cid.get("cid_invalid_002")

        assert ok_res and ok_res.get("status") == "ok", f"TR-12.1 valid item status wrong: {ok_res}"
        assert ok_res.get("tour_id") == tid, "TR-12.1 valid item tour_id mismatch"
        ok_eid = ok_res.get("expense_id")
        assert ok_eid is not None and ok_eid > 0, f"TR-12.1 valid item expense_id invalid: {ok_eid}"
        ok_exp = ok_res.get("expense") or {}
        ok_amt = ok_exp.get("amount")
        assert ok_amt is not None and abs(float(ok_amt) - 25.00) < 0.005, f"TR-12.1 valid item amount mismatch: {ok_amt}"
        ok_cat = ok_exp.get("category")
        ok_cat_val = ok_cat.get("value") if isinstance(ok_cat, dict) else ok_cat
        assert ok_cat_val == "food", f"TR-12.1 valid item category mismatch: {ok_cat}"

        # Verify the expense row actually exists in DB
        db_exp = Expense.objects.filter(pk=ok_eid).first()
        assert db_exp is not None, f"TR-12.1 valid expense not saved in DB id={ok_eid}"
        assert abs(float(db_exp.amount) - 25.00) < 0.005, "TR-12.1 DB amount mismatch"
        assert db_exp.category == "food", "TR-12.1 DB category mismatch"

        # Invalid item checks
        assert err_res and err_res.get("status") == "error", f"TR-12.1 invalid item status wrong: {err_res}"
        err_obj = err_res.get("error")
        amount_err = None
        if isinstance(err_obj, dict):
            amount_err = err_obj.get("amount")
            if isinstance(amount_err, list) and len(amount_err) > 0:
                amount_err = str(amount_err[0])
            elif amount_err is not None:
                amount_err = str(amount_err)
        elif isinstance(err_obj, str):
            amount_err = err_obj if "amount" in err_obj.lower() or "greater than zero" in err_obj.lower() else None
        assert amount_err is not None and len(amount_err) > 0, f"TR-12.1 invalid item missing amount error: err_obj={err_obj}"
        print("TR-12.1 PASS: batch valid+invalid -> ok=1 error=1")
    except AssertionError as ae:
        print(f"TR-12.1 FAIL: {ae}")
        fail += 1

    # ------------------------------------------------------------------
    # TR-12.2 Outsider uO syncs a payload item referencing tour tid
    # Expected: HTTP 200 (endpoint always 200 for batch), that item status=error
    #   error contains "not a member"
    # ------------------------------------------------------------------
    outsider_payload = {
        "tour_id": tid,
        "title": "TR-12 outsider attempt",
        "amount": "50.00",
        "category": "shopping",
        "payment_method": "online_transfer",
        "paid_by": uO.pk,
        "split_members": [uO.pk],
    }
    outsider_batch = {"pending": [{"client_id": "cid_out_003", "payload": outsider_payload}]}
    resp2 = clientO.post(SYNC_URL, data=outsider_batch, format="json", **hdrO)
    try:
        assert resp2.status_code == 200, f"TR-12.2 expected 200 got {resp2.status_code}"
        d2 = resp2.json()
        r2 = d2.get("results") or []
        assert len(r2) == 1, f"TR-12.2 expected 1 result got {len(r2)}"
        assert d2.get("ok_count") == 0, f"TR-12.2 ok_count should be 0 got {d2.get('ok_count')}"
        assert d2.get("error_count") == 1, f"TR-12.2 error_count should be 1 got {d2.get('error_count')}"
        item = r2[0]
        assert item.get("status") == "error", f"TR-12.2 outsider item status not error: {item}"
        err2 = item.get("error")
        err2_str = ""
        if isinstance(err2, str):
            err2_str = err2.lower()
        elif isinstance(err2, dict):
            # Flatten values to one string for substring check
            parts = []
            for v in err2.values():
                if isinstance(v, list):
                    parts.extend([str(x).lower() for x in v])
                else:
                    parts.append(str(v).lower())
            err2_str = " ".join(parts)
        assert "not a member" in err2_str or "member" in err2_str, f"TR-12.2 outsider error msg missing membership check: err={err2}"
        # Ensure expense was NOT created
        assert not Expense.objects.filter(title="TR-12 outsider attempt").exists(), "TR-12.2 outsider expense leaked into DB"
        print("TR-12.2 PASS: outsider batch item -> blocked with membership error")
    except AssertionError as ae:
        print(f"TR-12.2 FAIL: {ae}")
        fail += 1

    # ------------------------------------------------------------------
    # TR-12.3 Empty batch and malformed non-list payload edge checks
    # ------------------------------------------------------------------
    try:
        resp_empty = clientA.post(SYNC_URL, data={"pending": []}, format="json", **hdrA)
        assert resp_empty.status_code == 200, f"TR-12.3 empty batch status wrong: {resp_empty.status_code}"
        de = resp_empty.json()
        assert de.get("total") == 0 and de.get("ok_count") == 0 and de.get("error_count") == 0, f"TR-12.3 empty batch counts wrong: {de}"
        # Malformed: pending is not a list
        resp_bad = clientA.post(SYNC_URL, data={"pending": "notalist"}, format="json", **hdrA)
        assert resp_bad.status_code == 400, f"TR-12.3 malformed pending expected 400 got {resp_bad.status_code}"
        print("TR-12.3 PASS: empty batch + malformed payload edge checks")
    except AssertionError as ae:
        print(f"TR-12.3 FAIL: {ae}")
        fail += 1

    # ------------------------------------------------------------------
    # TR-12.4 Tour id does not exist in payload
    # ------------------------------------------------------------------
    try:
        nonexist_tid = 99999999
        dne_payload = {
            "tour_id": nonexist_tid,
            "title": "TR-12 dne tour",
            "amount": "10.00",
            "category": "other",
            "payment_method": "cash",
            "paid_by": uA.pk,
            "split_members": [uA.pk],
        }
        dne_batch = {"pending": [{"client_id": "cid_dne_004", "payload": dne_payload}]}
        resp_dne = clientA.post(SYNC_URL, data=dne_batch, format="json", **hdrA)
        assert resp_dne.status_code == 200
        ddne = resp_dne.json()
        assert ddne.get("ok_count") == 0 and ddne.get("error_count") == 1
        rdne = ddne["results"][0]
        assert rdne.get("status") == "error"
        err_dne = rdne.get("error")
        err_dne_str = err_dne if isinstance(err_dne, str) else str(err_dne)
        assert "not exist" in err_dne_str.lower() or "does not exist" in err_dne_str.lower(), f"TR-12.4 dne err missing 'not exist': {err_dne}"
        print("TR-12.4 PASS: nonexistent tour_id -> Tour does not exist error")
    except AssertionError as ae:
        print(f"TR-12.4 FAIL: {ae}")
        fail += 1

    # ------------------------------------------------------------------
    # TR-12.5 Notification hook & limit check fired during sync (side effects)
    # Verify the valid $25 food expense above generated a notification for uB
    # (notify_new_expense excludes paid_by=uA and created_by=uA so only uB receives)
    # ------------------------------------------------------------------
    try:
        valid_exp_obj = Expense.objects.filter(title="TR-12 lunch valid", tour=tour, paid_by=uA).first()
        assert valid_exp_obj is not None, "TR-12.5 prereq valid expense missing"
        notifs_for_uB = Notification.objects.filter(
            recipient=uB, tour=tour, related_object_id=valid_exp_obj.pk, type="new_expense"
        ).count()
        notifs_for_uA = Notification.objects.filter(
            recipient=uA, tour=tour, related_object_id=valid_exp_obj.pk, type="new_expense"
        ).count()
        assert notifs_for_uB == 1, f"TR-12.5 uB new_expense notif expected 1 got {notifs_for_uB}"
        assert notifs_for_uA == 0, f"TR-12.5 uA should be excluded got {notifs_for_uA}"
        # Verify ExpenseSplit auto-created for equal share: $25 / 2 users = 12.50 each
        splits_count = ExpenseSplit.objects.filter(expense=valid_exp_obj).count()
        assert splits_count == 2, f"TR-12.5 splits expected 2 got {splits_count}"
        split_shares = list(
            ExpenseSplit.objects.filter(expense=valid_exp_obj).order_by('user_id').values_list('share_amount', flat=True)
        )
        total_split = sum([Decimal(str(s)) for s in split_shares])
        assert abs(float(total_split) - 25.00) < 0.005, f"TR-12.5 split sum mismatch: {total_split}"
        print("TR-12.5 PASS: notification hook correctly fired during sync + equal splits created correctly")
    except AssertionError as ae:
        print(f"TR-12.5 FAIL: {ae}")
        fail += 1

    # Cleanup after tests
    cleanup_user_emails(
        [emailA, emailB, emailO],
        [phoneA, phoneB, phoneO],
    )

    if fail == 0:
        print("=== TASK12 ALL TR PASS (5 scenarios) ===")
        sys.exit(0)
    else:
        print(f"=== TASK12 FAIL: {fail} assertion(s) failed ===")
        sys.exit(1)


if __name__ == "__main__":
    run()
