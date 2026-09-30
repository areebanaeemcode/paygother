"""Task 5 TR scenario (Expense CRUD + splits)."""
import os
import sys
import django
from decimal import Decimal

BASE_DIR = r"c:\Users\muham\Downloads\FYP (1)\FYP"
sys.path.insert(0, BASE_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.db import transaction as db_trans
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.tours.models import Tour, TourMember
from apps.expenses.models import Expense, ExpenseSplit

User = get_user_model()


def fresh_phone(prefix, i):
    return f"+9990005{prefix}{i:02d}"


def auth_client(user):
    refresh = RefreshToken.for_user(user)
    c = APIClient()
    c.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return c


def run():
    # --- Setup 3 tour members + 1 outsider + 1 tour
    emails = [
        ("t5a_last", "t5a@example.com", fresh_phone("A", 1)),
        ("t5b_last", "t5b@example.com", fresh_phone("A", 2)),
        ("t5c_last", "t5c@example.com", fresh_phone("A", 3)),
        ("t5out_last", "t5out@example.com", fresh_phone("A", 9)),
    ]
    users = []
    for (ln, em, ph) in emails:
        u, _ = User.objects.get_or_create(
            email=em,
            defaults={
                "first_name": f"T5User{len(users)+1}",
                "last_name": ln,
                "phone_number": ph,
                "is_active": True,
            },
        )
        u.set_password("T5pass_123")
        u.save(update_fields=["password"])
        users.append(u)
    uA, uB, uC, uOut = users

    # Clear stale memberships
    TourMember.objects.filter(user__in=users).delete()
    # Clear stale expenses for these users
    Expense.objects.filter(tour__memberships__user__in=users).delete()

    from datetime import date

    # Create tour with creator uA
    tour = Tour.objects.create(
        title="Task 5 Test Tour",
        destination="Task5 Test Location",
        budget=Decimal("1000.00"),
        start_date=date(2026, 9, 1),
        end_date=date(2026, 9, 10),
        created_by=uA,
    )
    TourMember.objects.create(tour=tour, user=uA, role="creator")
    TourMember.objects.create(tour=tour, user=uB, role="member")
    TourMember.objects.create(tour=tour, user=uC, role="member")
    tour.refresh_from_db()

    cA = auth_client(uA)
    cB = auth_client(uB)
    cOut = auth_client(uOut)

    fail = 0

    # --- TR-5.1 Non-member POST create expense -> 403
    payload = {
        "tour_id": tour.id,
        "title": "Non member expense",
        "amount": "50.00",
        "category": "food",
        "payment_method": "cash",
        "paid_by": uA.id,
        "split_members": [uA.id, uB.id, uC.id],
        "share_amounts": ["20.00", "15.00", "15.00"],
    }
    r1 = cOut.post("/client/expenses/api/create/", payload, format="json")
    if r1.status_code != 403:
        print(f"TR-5.1 FAIL status={r1.status_code} body={r1.content[:200]!r}")
        fail += 1
    else:
        print(f"TR-5.1 PASS (outsider create -> 403)")

    # --- TR-5.2 Member POST valid expense -> 201 + assertions
    # 5.2a: sum(share_amounts) == amount explicit
    payload2 = {
        "tour_id": tour.id,
        "title": "Dinner explicit split",
        "amount": "120.00",
        "category": "food",
        "payment_method": "card",
        "paid_by": uA.id,
        "split_members": [uA.id, uB.id, uC.id],
        "share_amounts": ["50.00", "40.00", "30.00"],
        "notes": "Dinner notes",
    }
    r2 = cA.post("/client/expenses/api/create/", payload2, format="json")
    if r2.status_code != 201:
        print(f"TR-5.2a FAIL status={r2.status_code} body={r2.content[:400]!r}")
        fail += 1
    else:
        d = r2.data
        exp_id_a = d["id"]
        if str(d["amount"]) != "120.00":
            print(f"TR-5.2a FAIL amount={d['amount']}")
            fail += 1
        if d["category"]["value"] != "food" or d["payment_method"]["value"] != "card":
            print(f"TR-5.2a FAIL enum={d['category']}/{d['payment_method']}")
            fail += 1
        if d["paid_by"]["id"] != uA.id:
            print(f"TR-5.2a FAIL paid_by id={d['paid_by']}")
            fail += 1
        splits = d["splits"]
        if len(splits) != 3:
            print(f"TR-5.2a FAIL splits len={len(splits)}")
            fail += 1
        total_splits = sum(Decimal(str(s["share_amount"])) for s in splits)
        if total_splits != Decimal("120.00"):
            print(f"TR-5.2a FAIL splits sum={total_splits}")
            fail += 1
        # DB assertion
        db_exp = Expense.objects.get(pk=exp_id_a)
        db_splits = ExpenseSplit.objects.filter(expense=db_exp)
        if db_splits.count() != 3:
            print(f"TR-5.2a FAIL DB splits={db_splits.count()}")
            fail += 1
        else:
            print(f"TR-5.2a PASS (explicit splits 201)")

    # 5.2b: No share_amounts provided -> equal split. Use 3 members + 100.00
    payload3 = {
        "tour_id": tour.id,
        "title": "Snacks equal split",
        "amount": "100.00",
        "category": "food",
        "payment_method": "cash",
        "paid_by": uB.id,
        "split_members": [uA.id, uB.id, uC.id],
    }
    r3 = cA.post("/client/expenses/api/create/", payload3, format="json")
    if r3.status_code != 201:
        print(f"TR-5.2b FAIL status={r3.status_code} body={r3.content[:400]!r}")
        fail += 1
    else:
        d = r3.data
        splits = d["splits"]
        shares = sorted([Decimal(str(s["share_amount"])) for s in splits])
        # 100.00 /3 = 33.33 + 33.33 + 33.34
        expected = sorted([Decimal("33.33"), Decimal("33.33"), Decimal("33.34")])
        if shares != expected:
            print(f"TR-5.2b FAIL equal split actual={shares} expected={expected}")
            fail += 1
        else:
            print(f"TR-5.2b PASS (equal split 100.00/3)")

    # 5.2c: empty split_members -> default to ALL tour members
    payload4 = {
        "tour_id": tour.id,
        "title": "Default all members",
        "amount": "30.00",
        "category": "other",
        "payment_method": "cash",
        "paid_by": uA.id,
    }
    r4 = cA.post("/client/expenses/api/create/", payload4, format="json")
    if r4.status_code != 201:
        print(f"TR-5.2c FAIL status={r4.status_code} body={r4.content[:400]!r}")
        fail += 1
    else:
        d = r4.data
        if len(d["splits"]) != 3:
            print(f"TR-5.2c FAIL splits len={len(d['splits'])}")
            fail += 1
        else:
            print(f"TR-5.2c PASS (default all members)")

    # 5.2d invalid amount <=0 -> 400
    r_bad_amt = cA.post(
        "/client/expenses/api/create/",
        {"tour_id": tour.id, "title": "bad", "amount": "0", "category": "food",
         "payment_method": "cash", "paid_by": uA.id,
         "split_members": [uA.id, uB.id, uC.id]},
        format="json",
    )
    if r_bad_amt.status_code != 400:
        print(f"TR-5.2d FAIL bad amount status={r_bad_amt.status_code}")
        fail += 1
    else:
        print(f"TR-5.2d PASS (amount<=0 -> 400)")

    # 5.2e outsider paid_by -> 400
    r_bad_pb = cA.post(
        "/client/expenses/api/create/",
        {"tour_id": tour.id, "title": "bad", "amount": "10",
         "category": "food", "payment_method": "cash",
         "paid_by": uOut.id, "split_members": [uA.id, uB.id]},
        format="json",
    )
    if r_bad_pb.status_code != 400:
        print(f"TR-5.2e FAIL outsider paid_by status={r_bad_pb.status_code}")
        fail += 1
    else:
        print(f"TR-5.2e PASS (outsider paid_by -> 400)")

    # 5.2f outsider split_member -> 400
    r_bad_sp = cA.post(
        "/client/expenses/api/create/",
        {"tour_id": tour.id, "title": "bad", "amount": "10",
         "category": "food", "payment_method": "cash",
         "paid_by": uA.id, "split_members": [uA.id, uOut.id]},
        format="json",
    )
    if r_bad_sp.status_code != 400:
        print(f"TR-5.2f FAIL outsider split status={r_bad_sp.status_code} body={r_bad_sp.content[:200]!r}")
        fail += 1
    else:
        print(f"TR-5.2f PASS (outsider in splits -> 400)")

    # 5.2g sum splits != amount -> 400
    r_bad_sum = cA.post(
        "/client/expenses/api/create/",
        {"tour_id": tour.id, "title": "bad sum", "amount": "100",
         "category": "food", "payment_method": "cash",
         "paid_by": uA.id,
         "split_members": [uA.id, uB.id, uC.id],
         "share_amounts": ["10", "10", "10"]},
        format="json",
    )
    if r_bad_sum.status_code != 400:
        print(f"TR-5.2g FAIL splits sum status={r_bad_sum.status_code} body={r_bad_sum.content[:200]!r}")
        fail += 1
    else:
        print(f"TR-5.2g PASS (sum splits != amount -> 400)")

    # 5.2h bad category -> 400
    r_bad_cat = cA.post(
        "/client/expenses/api/create/",
        {"tour_id": tour.id, "title": "bad", "amount": "10",
         "category": "notacat", "payment_method": "cash",
         "paid_by": uA.id, "split_members": [uA.id]},
        format="json",
    )
    if r_bad_cat.status_code != 400:
        print(f"TR-5.2h FAIL bad category status={r_bad_cat.status_code}")
        fail += 1
    else:
        print(f"TR-5.2h PASS (bad category -> 400)")

    # --- TR-5.3 List expense: non-member -> 403; member -> 200 count; filters
    r_list_out = cOut.get(f"/client/expenses/api/?tour_id={tour.id}")
    if r_list_out.status_code != 403:
        print(f"TR-5.3a FAIL outsider list status={r_list_out.status_code}")
        fail += 1
    else:
        print(f"TR-5.3a PASS (outsider list -> 403)")

    r_list_a = cA.get(f"/client/expenses/api/?tour_id={tour.id}")
    if r_list_a.status_code != 200:
        print(f"TR-5.3b FAIL member list status={r_list_a.status_code}")
        fail += 1
    else:
        data = r_list_a.data
        items = data if isinstance(data, list) else data.get("results", [])
        if len(items) < 3:
            print(f"TR-5.3b FAIL list len={len(items)}")
            fail += 1
        else:
            print(f"TR-5.3b PASS (member list len={len(items)})")

    # 5.3c category filter
    r_cat = cA.get(f"/client/expenses/api/?tour_id={tour.id}&category=food")
    if r_cat.status_code != 200:
        print(f"TR-5.3c FAIL filter status={r_cat.status_code}")
        fail += 1
    else:
        items = r_cat.data if isinstance(r_cat.data, list) else r_cat.data.get("results", [])
        any_non_food = any(
            (isinstance(x.get("category"), dict) and x["category"]["value"] != "food")
            or (not isinstance(x.get("category"), dict) and x.get("category") != "food")
            for x in items
        )
        if any_non_food:
            print(f"TR-5.3c FAIL non-food in results: {[x.get('category') for x in items]}")
            fail += 1
        else:
            print(f"TR-5.3c PASS (category filter)")

    # 5.3d payment_method filter
    r_pm = cA.get(f"/client/expenses/api/?tour_id={tour.id}&payment_method=card")
    if r_pm.status_code != 200:
        print(f"TR-5.3d FAIL filter pm status={r_pm.status_code}")
        fail += 1
    else:
        items = r_pm.data if isinstance(r_pm.data, list) else r_pm.data.get("results", [])
        any_bad = any(
            (isinstance(x.get("payment_method"), dict) and x["payment_method"]["value"] != "card")
            or (not isinstance(x.get("payment_method"), dict) and x.get("payment_method") != "card")
            for x in items
        )
        if any_bad:
            print(f"TR-5.3d FAIL pm filter")
            fail += 1
        else:
            print(f"TR-5.3d PASS (payment_method filter)")

    # --- TR-5.4 Detail expense: non-member -> 403; member -> 200 splits count
    some_exp = Expense.objects.filter(tour=tour).order_by("pk").first()
    if not some_exp:
        print("TR-5.4 ABORT no expense")
        fail += 1
    else:
        r_det_out = cOut.get(f"/client/expenses/api/{some_exp.id}/")
        if r_det_out.status_code != 403:
            print(f"TR-5.4a FAIL outsider detail status={r_det_out.status_code}")
            fail += 1
        else:
            print(f"TR-5.4a PASS (outsider detail -> 403)")

        r_det_mem = cB.get(f"/client/expenses/api/{some_exp.id}/")
        if r_det_mem.status_code != 200:
            print(f"TR-5.4b FAIL member detail status={r_det_mem.status_code}")
            fail += 1
        else:
            d = r_det_mem.data
            db_count = ExpenseSplit.objects.filter(expense_id=some_exp.id).count()
            if len(d["splits"]) != db_count:
                print(f"TR-5.4b FAIL splits count api={len(d['splits'])} db={db_count}")
                fail += 1
            else:
                print(f"TR-5.4b PASS (member detail splits={db_count})")

    # --- TR-5.5 Update: non-editor -> 403; editor -> 200 splits updated
    # Create expense paid_by uA, created_by uA -> editors {uA + creator tour (uA)}
    exp_for_edit = Expense.objects.create(
        tour=tour, title="Before edit", amount=Decimal("60.00"),
        category="transport", payment_method="cash",
        paid_by=uA, created_by=uA,
    )
    for (uid, share) in [(uA.id, "30.00"), (uB.id, "20.00"), (uC.id, "10.00")]:
        ExpenseSplit.objects.create(expense=exp_for_edit, user_id=uid, share_amount=Decimal(share))

    r_upd_out = cOut.patch(
        f"/client/expenses/api/{exp_for_edit.id}/",
        {"tour_id": tour.id, "title": "After edit", "amount": "60.00",
         "category": "transport", "payment_method": "cash",
         "paid_by": uA.id, "split_members": [uA.id, uB.id, uC.id],
         "share_amounts": ["20", "20", "20"]},
        format="json",
    )
    if r_upd_out.status_code != 403:
        print(f"TR-5.5a FAIL outsider patch status={r_upd_out.status_code}")
        fail += 1
    else:
        print(f"TR-5.5a PASS (outsider patch -> 403)")

    # Non-editor uB (not paid_by, not creator, not tour creator)
    # Tour creator is uA, paid_by uA -> uB isn't an editor
    r_upd_b = cB.patch(
        f"/client/expenses/api/{exp_for_edit.id}/",
        {"tour_id": tour.id, "title": "After edit B", "amount": "60.00",
         "category": "transport", "payment_method": "cash",
         "paid_by": uA.id, "split_members": [uA.id, uB.id, uC.id],
         "share_amounts": ["20", "20", "20"]},
        format="json",
    )
    if r_upd_b.status_code != 403:
        print(f"TR-5.5b FAIL non-editor B patch status={r_upd_b.status_code} body={r_upd_b.content[:200]!r}")
        fail += 1
    else:
        print(f"TR-5.5b PASS (non-editor B patch -> 403)")

    # Editor uA patch OK
    r_upd_a = cA.patch(
        f"/client/expenses/api/{exp_for_edit.id}/",
        {"tour_id": tour.id, "title": "After edit by A",
         "amount": "60.00", "category": "shopping",
         "payment_method": "online_transfer",
         "paid_by": uA.id, "split_members": [uA.id, uB.id, uC.id],
         "share_amounts": ["10.00", "20.00", "30.00"]},
        format="json",
    )
    if r_upd_a.status_code != 200:
        print(f"TR-5.5c FAIL editor patch status={r_upd_a.status_code} body={r_upd_a.content[:400]!r}")
        fail += 1
    else:
        d = r_upd_a.data
        if d["title"] != "After edit by A":
            print(f"TR-5.5c FAIL title={d['title']}")
            fail += 1
        if d["category"]["value"] != "shopping" or d["payment_method"]["value"] != "online_transfer":
            print(f"TR-5.5c FAIL enums update")
            fail += 1
        shares = {s["user_id"]: Decimal(str(s["share_amount"])) for s in d["splits"]}
        expected = {uA.id: Decimal("10.00"), uB.id: Decimal("20.00"), uC.id: Decimal("30.00")}
        if shares != expected:
            print(f"TR-5.5c FAIL updated shares={shares} expected={expected}")
            fail += 1
        else:
            print(f"TR-5.5c PASS (editor patch -> 200 splits updated)")

    # --- TR-5.6 Delete: non-editor -> 403; editor -> 200 DB row count decreases + cascade splits
    exp_for_del = Expense.objects.create(
        tour=tour, title="Delete me", amount=Decimal("25.00"),
        category="food", payment_method="cash",
        paid_by=uA, created_by=uA,
    )
    for uid in [uA.id, uB.id]:
        ExpenseSplit.objects.create(expense=exp_for_del, user_id=uid, share_amount=Decimal("12.50"))

    before_count = Expense.objects.filter(tour=tour).count()

    r_del_out = cOut.delete(f"/client/expenses/api/{exp_for_del.id}/delete/")
    if r_del_out.status_code != 403:
        print(f"TR-5.6a FAIL outsider delete status={r_del_out.status_code}")
        fail += 1
    else:
        print(f"TR-5.6a PASS (outsider delete -> 403)")

    r_del_b = cB.delete(f"/client/expenses/api/{exp_for_del.id}/delete/")
    if r_del_b.status_code != 403:
        print(f"TR-5.6b FAIL non-editor B delete status={r_del_b.status_code} body={r_del_b.content[:200]!r}")
        fail += 1
    else:
        print(f"TR-5.6b PASS (non-editor B delete -> 403)")

    r_del_a = cA.delete(f"/client/expenses/api/{exp_for_del.id}/delete/")
    after_count = Expense.objects.filter(tour=tour).count()
    splits_after = ExpenseSplit.objects.filter(expense_id=exp_for_del.id).count()
    if r_del_a.status_code != 200:
        print(f"TR-5.6c FAIL editor delete status={r_del_a.status_code} body={r_del_a.content[:200]!r}")
        fail += 1
    elif after_count != before_count - 1:
        print(f"TR-5.6c FAIL count before={before_count} after={after_count}")
        fail += 1
    elif splits_after != 0:
        print(f"TR-5.6c FAIL splits cascade remaining={splits_after}")
        fail += 1
    else:
        print(f"TR-5.6c PASS (editor delete -> 200 cascade OK)")

    if fail == 0:
        print("=== TASK 5 ALL TR EVIDENCE PASS ===")
        return 0
    print(f"=== TASK 5 FAILURES: {fail} ===")
    return 1


if __name__ == "__main__":
    sys.exit(run())
