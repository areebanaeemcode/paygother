import os, sys, django
sys.path.insert(0, r"c:\Users\muham\Downloads\FYP (1)\FYP")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.test.utils import setup_test_environment
setup_test_environment()

from datetime import date, datetime, timezone as tz
from apps.accounts.models import User
from apps.tours.models import Tour, TourMember
from apps.expenses.models import Expense, ExpenseSplit
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

PY = "C:\\Users\\muham\\python-sdk\\python3.13.2\\python.exe"

def header_for(user):
    tok = RefreshToken.for_user(user)
    return {"HTTP_AUTHORIZATION": f"Bearer {tok.access_token}"}


def run():
    fail = 0
    email = "user_tr7_a@example.com"
    email2 = "user_tr7_b@example.com"
    email3 = "user_tr7_outsider@example.com"
    phone = "+923000777001"
    phone2 = "+923000777002"
    phone3 = "+923000777003"
    User.objects.filter(email__in=[email, email2, email3]).delete()
    User.objects.filter(phone_number__in=[phone, phone2, phone3]).delete()

    u = User.objects.create_user(email=email, first_name="Ali", last_name="Ahmed", phone_number=phone, password="Pass123!ok")
    u2 = User.objects.create_user(email=email2, first_name="Bilal", last_name="Butt", phone_number=phone2, password="Pass123!ok")
    u3 = User.objects.create_user(email=email3, first_name="C", last_name="Outsider", phone_number=phone3, password="Pass123!ok")

    TourMember.objects.filter(tour__title__startswith="TR-7").delete()
    Tour.objects.filter(title__startswith="TR-7").delete()

    # TR-7.1 empty tour default
    client = APIClient()
    hdr = header_for(u)
    tour1 = Tour.objects.create(title="TR-7 empty smart", destination="Lahore", budget=10000, start_date=date(2026,9,1), end_date=date(2026,9,5), created_by=u)
    TourMember.objects.get_or_create(tour=tour1, user=u, defaults={"role": "creator"})

    r = client.get(f"/client/tours/api/{tour1.pk}/smart/", **hdr)
    print(f"[TR-7.1] empty tour smart status={r.status_code}")
    try:
        assert r.status_code == 200, f"status={r.status_code}"
        d = r.json()
        assert isinstance(d, dict), "response not object"
        assert "suggested_category" in d, "missing suggested_category"
        assert d["suggested_category"]["value"] == "other", f"suggested not other -> {d['suggested_category']}"
        assert d["top_categories"] == [], f"top categories not empty: {d['top_categories']}"
        assert d["high_spend_categories"] == [], f"high_spend not empty: {d['high_spend_categories']}"
        assert d["total_spent"] == 0.0, f"total_spent != 0 -> {d['total_spent']}"
        assert "expenses" in (d.get("reason") or "").lower() or "starting" in (d.get("reason") or "").lower(), f"reason mismatch: {d.get('reason')}"
        print(f"[TR-7.1 PASS] empty defaults OK -> suggestion={d['suggested_category']}")
    except AssertionError as e:
        fail += 1
        print(f"[TR-7.1 FAIL] {e}")

    # TR-7.2 keyword match title=taxi to airport
    r2 = client.get(f"/client/tours/api/{tour1.pk}/smart/?title=taxi%20to%20airport", **hdr)
    print(f"[TR-7.2] keyword smart status={r2.status_code}")
    try:
        assert r2.status_code == 200, f"status={r2.status_code}"
        d2 = r2.json()
        assert d2["suggested_category"]["value"] == "transport", f"suggested not transport -> {d2['suggested_category']}"
        reason = (d2.get("reason") or "").lower()
        assert "keyword" in reason or "matched" in reason, f"reason missing keyword: {d2.get('reason')}"
        print(f"[TR-7.2 PASS] keyword match OK -> suggested={d2['suggested_category']} reason={d2.get('reason')}")
    except AssertionError as e:
        fail += 1
        print(f"[TR-7.2 FAIL] {e}")

    # TR-7.2b outsider 403
    hdr3 = header_for(u3)
    r_out = client.get(f"/client/tours/api/{tour1.pk}/smart/", **hdr3)
    try:
        assert r_out.status_code == 403, f"outsider not 403 -> {r_out.status_code}"
        print("[TR-7.2b PASS] outsider -> 403")
    except AssertionError as e:
        fail += 1
        print(f"[TR-7.2b FAIL] {e}")

    # TR-7.3 history-based suggestion + high_spend_categories >=30%
    tour2 = Tour.objects.create(title="TR-7 food transport budget", destination="Karachi", budget=5000, start_date=date(2026,10,1), end_date=date(2026,10,5), created_by=u)
    TourMember.objects.get_or_create(tour=tour2, user=u, defaults={"role":"creator"})
    TourMember.objects.get_or_create(tour=tour2, user=u2, defaults={"role":"member"})

    def mk(cat, amt, title, paid):
        e = Expense.objects.create(tour=tour2, created_by=u, paid_by=paid, title=title, notes="", amount=amt, category=cat, payment_method="cash", paid_at=datetime(2026,10,2,12,0,0,tzinfo=tz.utc))
        ExpenseSplit.objects.create(expense=e, user=u, share_amount=amt/2)
        ExpenseSplit.objects.create(expense=e, user=u2, share_amount=amt/2)
        return e

    mk("food", 450.00, "Big dinner", u)
    mk("transport", 300.00, "Cab ride", u)
    mk("other", 250.00, "Misc tips", u)

    r3 = client.get(f"/client/tours/api/{tour2.pk}/smart/", **hdr)
    print(f"[TR-7.3] smart with history status={r3.status_code}")
    try:
        assert r3.status_code == 200, f"status={r3.status_code}"
        d3 = r3.json()
        total = float(d3.get("total_spent", -1))
        assert abs(total - 1000.0) < 0.01, f"total_spent != 1000 -> {total}"
        tops = d3["top_categories"]
        tops_map = {c["category"]["value"]: c for c in tops}
        assert "food" in tops_map, "food missing"
        assert "transport" in tops_map, "transport missing"
        assert "other" in tops_map, "other missing"
        pcts = {k: v["share_pct"] for k, v in tops_map.items()}
        print(f"  share_pcts: {pcts}")
        assert abs(pcts["food"] - 45.0) < 0.01, f"food share != 45%: {pcts['food']}"
        assert abs(pcts["transport"] - 30.0) < 0.01, f"transport share != 30%: {pcts['transport']}"
        assert abs(pcts["other"] - 25.0) < 0.01, f"other share != 25%: {pcts['other']}"
        high = d3["high_spend_categories"]
        high_vals = [c["category"]["value"] for c in high]
        print(f"  high_spend values: {high_vals}")
        assert len(high_vals) == 2, f"high_spend length != 2 -> {high_vals}"
        assert "food" in high_vals and "transport" in high_vals, f"expected food+transport in high_spend: {high_vals}"
        # suggested category should be food (history most spent)
        sug = d3["suggested_category"]
        assert sug["value"] == "food", f"suggested not food -> {sug}"
        reason = (d3.get("reason") or "").lower()
        assert "history" in reason or "most frequently" in reason or "most" in reason, f"missing history reason: {d3.get('reason')}"
        print(f"[TR-7.3 PASS] totals={total}, shares={pcts}, high_spend={high_vals}, suggested={sug}")
    except AssertionError as e:
        fail += 1
        print(f"[TR-7.3 FAIL] {e}")
        import traceback; traceback.print_exc()

    # cleanup
    TourMember.objects.filter(tour__in=[tour1, tour2]).delete()
    ExpenseSplit.objects.filter(expense__tour__in=[tour1, tour2]).delete()
    Expense.objects.filter(tour__in=[tour1, tour2]).delete()
    Tour.objects.filter(pk__in=[tour1.pk, tour2.pk]).delete()
    User.objects.filter(pk__in=[u.pk, u2.pk, u3.pk]).delete()

    if fail == 0:
        print("=== TASK 7 ALL TR PASS ===")
        sys.exit(0)
    else:
        print(f"=== TASK 7 FAILURES: {fail} ===")
        sys.exit(1)


if __name__ == "__main__":
    run()
