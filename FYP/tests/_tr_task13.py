import os, sys, django
sys.path.insert(0, r"c:\Users\muham\Downloads\FYP (1)\FYP")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.test.utils import setup_test_environment
setup_test_environment()

from datetime import date as _date
from django.test.client import Client as DjangoClient
from apps.accounts.models import User
from apps.tours.models import Tour, TourMember
from apps.expenses.models import Expense, ExpenseSplit, ExpenseLimit, Receipt
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
    emailA = "user_tr13A@example.com"
    emailB = "user_tr13B@example.com"
    emailO = "user_tr13O@example.com"
    phoneA = "+923000999221"
    phoneB = "+923000999222"
    phoneO = "+923000999223"

    cleanup_user_emails([emailA, emailB, emailO], [phoneA, phoneB, phoneO])

    uA = User.objects.create_user(email=emailA, first_name="Ali", last_name="Ahmed", phone_number=phoneA, password="Pass123!ok")
    uB = User.objects.create_user(email=emailB, first_name="Bilal", last_name="B", phone_number=phoneB, password="Pass123!ok")
    uO = User.objects.create_user(email=emailO, first_name="Omar", last_name="O", phone_number=phoneO, password="Pass123!ok")

    TourMember.objects.filter(tour__title__startswith="TR-13").delete()
    Tour.objects.filter(title__startswith="TR-13").delete()
    Expense.objects.filter(title__startswith="TR-13").delete()

    # Create 2 tours for uA and 1 extra tour
    tour1 = Tour.objects.create(
        title="TR-13 Islamabad Trip", destination="Islamabad", budget=4000,
        start_date=_date(2026, 10, 1), end_date=_date(2026, 10, 6), created_by=uA,
    )
    TourMember.objects.get_or_create(tour=tour1, user=uA, defaults={"role": "creator"})
    TourMember.objects.get_or_create(tour=tour1, user=uB, defaults={"role": "member"})

    tour2 = Tour.objects.create(
        title="TR-13 Lahore Trip", destination="Lahore", budget=2500,
        start_date=_date(2026, 11, 12), end_date=_date(2026, 11, 15), created_by=uA,
    )
    TourMember.objects.get_or_create(tour=tour2, user=uA, defaults={"role": "creator"})

    tour3 = Tour.objects.create(
        title="TR-13 Karachi Trip", destination="Karachi", budget=3000,
        start_date=_date(2026, 12, 1), end_date=_date(2026, 12, 4), created_by=uB,
    )
    TourMember.objects.get_or_create(tour=tour3, user=uB, defaults={"role": "creator"})
    TourMember.objects.get_or_create(tour=tour3, user=uA, defaults={"role": "member"})

    # Create 3 notifications for uA (2 unread, 1 read) and 1 for uB unread (from tour1 expense created by uB)
    # We'll add a small expense via uB in tour1, which triggers notify_new_expense for uA (1 notif)
    # Then manually create 2 more notifs for uA to have 2 unread + 1 read = 3 total
    exp1 = Expense.objects.create(
        tour=tour1, title="TR-13 dinner", notes="Test notif",
        amount=Decimal("80.00"), category="food", payment_method="cash",
        paid_by=uB, created_by=uB,
    )
    ExpenseSplit.objects.get_or_create(expense=exp1, user=uA, share_amount=Decimal("40.00"))
    ExpenseSplit.objects.get_or_create(expense=exp1, user=uB, share_amount=Decimal("40.00"))
    try:
        from apps.notifications.hooks import notify_new_expense
        notify_new_expense(exp1)
    except Exception:
        pass

    # Add extra manual notifications for uA
    Notification.objects.create(
        recipient=uA, tour=tour1, type="member_joined",
        title="Bilal joined Islamabad Trip", message="Bilal is now part of the group.",
    )
    read_n = Notification.objects.create(
        recipient=uA, tour=tour2, type="new_expense",
        title="Old expense activity", message="Marked this as read.",
    )
    read_n.is_read = True
    read_n.save()

    page_client = DjangoClient()  # for regular page LoginRequiredMixin tests

    # ------------------------------------------------------------------
    # TR-13.1: Unauthenticated GET /client/dashboard/ -> 302 redirect (not login page 200)
    # ------------------------------------------------------------------
    try:
        resp = page_client.get("/client/dashboard/", follow=False)
        assert resp.status_code == 302, f"TR-13.1 unauth expected 302 got {resp.status_code}"
        loc = (resp.get("Location") or "").lower()
        assert "login" in loc, f"TR-13.1 redirect to login expected, got Location={resp.get('Location')}"
        print("TR-13.1 PASS: unauthenticated dashboard GET -> 302 login redirect")
    except AssertionError as ae:
        print(f"TR-13.1 FAIL: {ae}")
        fail += 1

    # ------------------------------------------------------------------
    # TR-13.2: Authenticated dashboard page 200 + HTML key elements present
    # (Force login for Django TestClient since LoginRequiredMixin needs session auth)
    # ------------------------------------------------------------------
    try:
        page_client.force_login(uA)
        resp2 = page_client.get("/client/dashboard/")
        html2 = resp2.content.decode("utf-8", errors="ignore")
        assert resp2.status_code == 200, f"TR-13.2 auth expected 200 got {resp2.status_code}"
        # Key elements
        assert "cardTotalTours" in html2, "TR-13.2 missing cardTotalTours id"
        assert "cardUnreadNotifs" in html2, "TR-13.2 missing cardUnreadNotifs id"
        assert "cardPendingOffline" in html2, "TR-13.2 missing cardPendingOffline id"
        assert "recentToursList" in html2, "TR-13.2 missing recentToursList container"
        assert "joinTourModal" in html2, "TR-13.2 missing joinTourModal markup"
        assert "bellBtn" in html2 and "bellBadge" in html2, "TR-13.2 missing bell button/badge"
        assert "profileBtn" in html2 and "profileDropdown" in html2, "TR-13.2 missing profile button/dropdown"
        assert "openJoinTourBtn" in html2, "TR-13.2 missing Join Tour CTA button"
        # Footer elements
        assert "©" in html2 or "Pay-Together" in html2, "TR-13.2 missing footer Pay-Together branding"
        # Breadcrumb-welcome should have first_name
        assert "Ali" in html2, "TR-13.2 missing welcome user name"
        # Onboarding sidebar
        assert "Quick onboarding" in html2, "TR-13.2 missing Quick onboarding sidebar"
        print("TR-13.2 PASS: authenticated dashboard page 200 + all key HTML elements present")
    except AssertionError as ae:
        print(f"TR-13.2 FAIL: {ae}")
        fail += 1

    # ------------------------------------------------------------------
    # TR-13.3: Context-injected card values server-side (total tours 3 for uA, unread notif 2)
    # Check pt_global_context exposes total_user_tours and unread_notification_count correctly
    # ------------------------------------------------------------------
    try:
        page_client.force_login(uA)
        resp3 = page_client.get("/client/dashboard/")
        html3 = resp3.content.decode("utf-8", errors="ignore")
        # Expected total tours for uA: tour1 (creator) + tour2 (creator) + tour3 (member) = 3 distinct
        # Extract by regex-ish simple scan
        import re as _re
        def extract_card(el_id, html):
            m = _re.search(r'id="%s"[^>]*data-value="([^"]*)"[^>]*>([^<]*)<' % _re.escape(el_id), html)
            if not m: return None
            dv = m.group(1).strip()
            tx = m.group(2).strip()
            return (dv, tx)

        tot = extract_card("cardTotalTours", html3)
        unr = extract_card("cardUnreadNotifs", html3)
        assert tot is not None, "TR-13.3 can't parse cardTotalTours"
        assert unr is not None, "TR-13.3 can't parse cardUnreadNotifs"
        # Total tours data value == 3 (tour1+tour2 creator; tour3 member)
        tour_count = Tour.objects.filter(memberships__user=uA).distinct().count()
        assert int(tot[0] or tot[1]) == tour_count, (
            f"TR-13.3 total_user_tours expected {tour_count} got data-value={tot[0]} text={tot[1]}"
        )
        # Unread notifications: we created notify_new_expense from expense uB paid (excludes uB so fires for uA=1) +
        #   manual member_joined unread (1) + marked-read 1 -> expected 2 unread
        unread_count = Notification.objects.filter(recipient=uA, is_read=False).count()
        got_unread = int(unr[0] or unr[1])
        assert got_unread == unread_count, (
            f"TR-13.3 unread expected {unread_count} got {got_unread}"
        )
        print(f"TR-13.3 PASS: context values correct — tours={tour_count}, unread={unread_count}")
    except AssertionError as ae:
        print(f"TR-13.3 FAIL: {ae}")
        fail += 1

    # ------------------------------------------------------------------
    # TR-13.4: Recent tours list rendered correctly (3 tour titles, links, destination chips)
    # ------------------------------------------------------------------
    try:
        page_client.force_login(uA)
        resp4 = page_client.get("/client/dashboard/")
        html4 = resp4.content.decode("utf-8", errors="ignore")
        # Each tour should be linked with detail_url href containing its id
        for t in (tour1, tour2, tour3):
            assert (f'/client/tours/{t.id}/' in html4), (
                f"TR-13.4 recent list missing tour link id={t.id} title={t.title}"
            )
        assert "Islamabad Trip" in html4, "TR-13.4 missing tour1 Islamabad title"
        assert "Lahore Trip" in html4, "TR-13.4 missing tour2 Lahore title"
        assert "Karachi Trip" in html4, "TR-13.4 missing tour3 Karachi title (via uA membership)"
        assert "Islamabad" in html4, "TR-13.4 missing destination chip Islamabad"
        print("TR-13.4 PASS: Recent tours list rendered all 3 user tours with destinations + detail links")
    except AssertionError as ae:
        print(f"TR-13.4 FAIL: {ae}")
        fail += 1

    # ------------------------------------------------------------------
    # TR-13.5: Notifications list page (completeness of Dashboard link target)
    #   - Unauth 302, Auth 200, contains notificationsList list wrapper + markAllReadBtn
    # ------------------------------------------------------------------
    try:
        logout_client = DjangoClient()
        resp_nauth = logout_client.get("/client/notifications/", follow=False)
        assert resp_nauth.status_code == 302, f"TR-13.5 unauth notifications expected 302 got {resp_nauth.status_code}"
        page_client.force_login(uA)
        resp5 = page_client.get("/client/notifications/")
        html5 = resp5.content.decode("utf-8", errors="ignore")
        assert resp5.status_code == 200, f"TR-13.5 auth notifications page expected 200 got {resp5.status_code}"
        assert "notificationsList" in html5, "TR-13.5 page missing notificationsList wrapper"
        assert "markAllReadBtn" in html5, "TR-13.5 page missing markAllReadBtn button"
        assert "summaryUnread" in html5 and "summaryTotal" in html5, "TR-13.5 page missing summary counters"
        print("TR-13.5 PASS: Notifications list page — unauth 302 redirect, auth 200 with list wrapper + mark all btn")
    except AssertionError as ae:
        print(f"TR-13.5 FAIL: {ae}")
        fail += 1

    # ------------------------------------------------------------------
    # TR-13.6: unread_notification_count=0 user (uB, only 1 notif from exp1 actually paid_by=uB
    #   so notify_new_expense excludes uB. Then add 1 notif for uB manually; uB now has 1. So test
    #   context processor = 1. Also total_user_tours for uB = tour1 (member) + tour3 (creator) = 2.
    # ------------------------------------------------------------------
    try:
        Notification.objects.create(
            recipient=uB, tour=tour3, type="member_joined",
            title="Ali joined Karachi Trip", message="Ali added to group.",
        )
        page_client.force_login(uB)
        resp6 = page_client.get("/client/dashboard/")
        html6 = resp6.content.decode("utf-8", errors="ignore")
        import re as _re2
        m_tot = _re2.search(r'id="cardTotalTours"[^>]*data-value="([^"]*)"', html6)
        m_unr = _re2.search(r'id="cardUnreadNotifs"[^>]*data-value="([^"]*)"', html6)
        uB_total = Tour.objects.filter(memberships__user=uB).distinct().count()
        uB_unread = Notification.objects.filter(recipient=uB, is_read=False).count()
        assert m_tot is not None and int(m_tot.group(1)) == uB_total, f"TR-13.6 uB total expected {uB_total} got {m_tot.group(1) if m_tot else None}"
        assert m_unr is not None and int(m_unr.group(1)) == uB_unread, f"TR-13.6 uB unread expected {uB_unread} got {m_unr.group(1) if m_unr else None}"
        print(f"TR-13.6 PASS: uB (2nd user) context correct — total={uB_total}, unread={uB_unread}")
    except AssertionError as ae:
        print(f"TR-13.6 FAIL: {ae}")
        fail += 1

    cleanup_user_emails([emailA, emailB, emailO], [phoneA, phoneB, phoneO])

    if fail == 0:
        print("=== TASK13 ALL TR PASS (6 scenarios) ===")
        sys.exit(0)
    else:
        print(f"=== TASK13 FAIL: {fail} assertion(s) failed ===")
        sys.exit(1)


if __name__ == "__main__":
    run()
