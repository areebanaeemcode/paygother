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
    emailA = "user_tr11A@example.com"
    emailB = "user_tr11B@example.com"
    emailO = "user_tr11O@example.com"
    phoneA = "+923000999201"
    phoneB = "+923000999202"
    phoneO = "+923000999203"

    cleanup_user_emails(
        [emailA, emailB, emailO],
        [phoneA, phoneB, phoneO],
    )

    uA = User.objects.create_user(email=emailA, first_name="Ali", last_name="Ahmed", phone_number=phoneA, password="Pass123!ok")
    uB = User.objects.create_user(email=emailB, first_name="Babar", last_name="B", phone_number=phoneB, password="Pass123!ok")
    uO = User.objects.create_user(email=emailO, first_name="Outsider", last_name="O", phone_number=phoneO, password="Pass123!ok")

    TourMember.objects.filter(tour__title__startswith="TR-11").delete()
    Tour.objects.filter(title__startswith="TR-11").delete()

    client = APIClient()
    hdrA = header_for(uA)
    hdrO = header_for(uO)

    tour = Tour.objects.create(
        title="TR-11 analytics tour", destination="Karachi", budget=5000,
        start_date=_date(2026, 9, 1), end_date=_date(2026, 9, 6), created_by=uA,
    )
    TourMember.objects.get_or_create(tour=tour, user=uA, defaults={"role": "creator"})
    TourMember.objects.get_or_create(tour=tour, user=uB, defaults={"role": "member"})

    # TR-11.1: Create expenses: Food $500, Transport $1200 (400+800 split into two), Activities $300
    # Expected totals: Food=500.00, Transport=1200.00, Activities=300.00. total_spent=2000. top=Transport 60%
    expenses_spec = [
        dict(title="Meal at Restaurant", amount="500.00", category="food"),
        dict(title="Taxi Ride Airport", amount="400.00", category="transport"),
        dict(title="Train Tickets", amount="800.00", category="transport"),
        dict(title="Museum Entry Tickets", amount="300.00", category="activities"),
    ]
    exp_ids = []
    for idx, spec in enumerate(expenses_spec):
        body = {
            "tour_id": tour.pk, "title": spec["title"], "amount": spec["amount"],
            "category": spec["category"], "payment_method": "card" if idx % 2 == 0 else "cash",
            "paid_by": uA.id, "split_members": [uA.id, uB.id],
        }
        r = client.post("/client/expenses/api/create/", data=body, format="json", **hdrA)
        print("[TR-11.1 step] " + spec["category"] + " $" + spec["amount"] + " status=" + str(r.status_code))
        try:
            assert r.status_code == 201, (spec["category"] + " status=" + str(r.status_code) + " " + str(r.content[:200]))
            exp_ids.append(r.json().get("id"))
        except AssertionError as e:
            fail += 1
            print("[TR-11.1 FAIL step] " + str(e))

    # Now GET per-tour analytics API
    r_analytics = client.get("/client/tours/api/" + str(tour.pk) + "/analytics/", **hdrA)
    print()
    print("[TR-11.2] GET tour analytics status=" + str(r_analytics.status_code))
    try:
        assert r_analytics.status_code == 200, "analytics status=" + str(r_analytics.status_code)
        d = r_analytics.json()
        print("  keys: " + str(sorted(d.keys())))
        total_spent = float(d.get("total_spent") or 0)
        total_expenses = int(d.get("total_expenses") or 0)
        print("  total_spent=" + str(total_spent) + " total_expenses=" + str(total_expenses))
        assert abs(total_spent - 2000.00) < 0.005, "total_spent != 2000: " + str(total_spent)
        assert total_expenses == len(expenses_spec), "total_expenses != " + str(len(expenses_spec)) + ": " + str(total_expenses)

        categories = d.get("categories") or []
        by_value = {}
        for c in categories:
            cat = (c.get("category") or {}).get("value")
            by_value[cat] = c
            print("  category " + str(cat) + ": total=" + str(c.get("total")) + " share_pct=" + str(c.get("share_pct")))

        food_total = float((by_value.get("food") or {}).get("total") or 0)
        transport_total = float((by_value.get("transport") or {}).get("total") or 0)
        activities_total = float((by_value.get("activities") or {}).get("total") or 0)
        print("  computed: food=" + str(food_total) + " transport=" + str(transport_total) + " activities=" + str(activities_total))
        assert abs(food_total - 500.00) < 0.005, "food != 500: " + str(food_total)
        assert abs(transport_total - 1200.00) < 0.005, "transport != 1200: " + str(transport_total)
        assert abs(activities_total - 300.00) < 0.005, "activities != 300: " + str(activities_total)

        transport_share_pct = float((by_value.get("transport") or {}).get("share_pct") or 0)
        # transport 1200/2000 = 60%
        assert abs(transport_share_pct - 60.0) < 0.5, "transport share_pct != 60: " + str(transport_share_pct)

        top = d.get("top_category") or {}
        top_val = top.get("value")
        top_total = float(top.get("total") or 0)
        print("  top_category: value=" + str(top_val) + " total=" + str(top_total))
        assert top_val == "transport", "top_category not transport: " + str(top_val)
        assert abs(top_total - 1200.00) < 0.005, "top total != 1200: " + str(top_total)

        # totals/labels/colors
        labels = d.get("labels") or []
        totals_list = d.get("totals") or []
        print("  labels=" + str(labels) + " totals=" + str(totals_list))
        assert "Transport" in labels, "Transport not in labels: " + str(labels)
        assert "Food" in labels, "Food not in labels: " + str(labels)
        # sum totals list should match total_spent
        sum_l = sum(float(t) for t in totals_list)
        assert abs(sum_l - 2000.00) < 0.005, "sum(totals)=" + str(sum_l) + " vs 2000"

        print("[TR-11.2 PASS] Food 500, Transport 1200, Activities 300 all match; top=Transport 60%")
    except AssertionError as e:
        fail += 1
        print("[TR-11.2 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    # TR-11.3 Outsider GET tour analytics -> 403
    r_out = client.get("/client/tours/api/" + str(tour.pk) + "/analytics/", **hdrO)
    print()
    print("[TR-11.3] outsider tour analytics status=" + str(r_out.status_code))
    try:
        assert r_out.status_code == 403, "outsider expected 403: " + str(r_out.status_code)
        print("[TR-11.3 PASS] outsider blocked with 403")
    except AssertionError as e:
        fail += 1
        print("[TR-11.3 FAIL] " + str(e))

    # TR-11.4 Global analytics API for uA: total_spent=2000, 4 expenses, top category=transport
    r_global = client.get("/client/analytics/api/", **hdrA)
    print()
    print("[TR-11.4] GET global analytics status=" + str(r_global.status_code))
    try:
        assert r_global.status_code == 200, "global status=" + str(r_global.status_code)
        gd = r_global.json()
        gs = float(gd.get("total_spent") or 0)
        ge = int(gd.get("total_expenses") or 0)
        print("  global total_spent=" + str(gs) + " total_expenses=" + str(ge) + " total_tours=" + str(gd.get("total_tours")))
        assert abs(gs - 2000.00) < 0.005, "global total_spent != 2000: " + str(gs)
        assert ge == len(expenses_spec), "global total_expenses: " + str(ge)
        gtop = gd.get("top_category") or {}
        assert gtop.get("value") == "transport", "global top != transport: " + str(gtop.get("value"))
        top_tours = gd.get("top_tours") or []
        assert len(top_tours) >= 1, "top_tours should have our tour"
        tt_total = float(top_tours[0].get("total") or 0)
        assert abs(tt_total - 2000.00) < 0.005, "top tour total != 2000: " + str(tt_total)
        print("[TR-11.4 PASS] global aggregates match; top_tours includes tour total 2000")
    except AssertionError as e:
        fail += 1
        print("[TR-11.4 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    # TR-11.5 HTML tour analytics page renders 200
    page_client = APIClient()
    page_client.force_login(uA)
    r_page = page_client.get("/client/tours/" + str(tour.pk) + "/analytics/")
    print()
    print("[TR-11.5] GET tour analytics HTML page status=" + str(r_page.status_code))
    try:
        assert r_page.status_code == 200, "page status=" + str(r_page.status_code)
        html = r_page.content.decode("utf-8", errors="ignore") if hasattr(r_page, "content") else ""
        assert "Category Breakdown" in html, "page missing bar chart heading"
        assert "chart.js@4.4.0" in html.lower(), "page missing Chart.js CDN include"
        assert "__PT_ANALYTICS_MODE__" in html, "page missing analytics mode script injection"
        assert "__PT_TOUR_ID__" in html, "page missing tour id injection"
        assert "barChart" in html, "missing barChart canvas id"
        assert "donutChart" in html, "missing donutChart canvas id"
        print("[TR-11.5 PASS] tour analytics page contains Chart.js CDN, 2x canvas IDs, mode injection")
    except AssertionError as e:
        fail += 1
        print("[TR-11.5 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    # TR-11.6 HTML global analytics page renders 200
    r_global_page = page_client.get("/client/analytics/")
    print()
    print("[TR-11.6] GET global analytics HTML page status=" + str(r_global_page.status_code))
    try:
        assert r_global_page.status_code == 200, "global page status=" + str(r_global_page.status_code)
        html2 = r_global_page.content.decode("utf-8", errors="ignore") if hasattr(r_global_page, "content") else ""
        assert "All-Time Expense Analytics" in html2, "missing global heading"
        assert "chart.js@4.4.0" in html2.lower(), "missing Chart.js CDN"
        assert "barChart" in html2 and "donutChart" in html2, "missing canvas ids"
        print("[TR-11.6 PASS] global analytics page renders with 2 chart canvases")
    except AssertionError as e:
        fail += 1
        print("[TR-11.6 FAIL] " + str(e))
        import traceback; traceback.print_exc()

    print()
    if fail == 0:
        print("=== TASK 11 ALL TR PASS (" + str(6) + " scenarios) ===")
        sys.exit(0)
    else:
        print("=== TASK 11 TR FAIL: " + str(fail) + " assertions ===")
        sys.exit(1)


if __name__ == "__main__":
    run()
