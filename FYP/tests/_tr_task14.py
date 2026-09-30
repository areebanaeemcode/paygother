import os
import sys
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "stdlib_stubs"))

django.setup()

import time
import warnings
from pathlib import Path

from django.conf import settings
from django.test import Client
from django.contrib.auth import get_user_model

warnings.filterwarnings("ignore")

User = get_user_model()
BASE_DIR = Path(__file__).resolve().parent

def cleanup_test_users():
    emails_to_clean = ["tr14.admin@example.com"]
    for email in emails_to_clean:
        try:
            u = User.objects.get(email=email)
            from apps.expenses.models import Expense, ExpenseSplit
            from apps.notifications.models import Notification
            from apps.tours.models import TourMember, Tour
            ExpenseSplit.objects.filter(user=u).delete()
            Expense.objects.filter(paid_by=u).delete()
            Notification.objects.filter(recipient=u).delete()
            TourMember.objects.filter(user=u).delete()
            Tour.objects.filter(created_by=u).delete()
            u.delete()
        except User.DoesNotExist:
            pass

def main():
    cleanup_test_users()
    fail = 0
    client = Client()

    print("=" * 64)
    print("TR-14: Admin Access Pass Middleware Test Suite")
    print("=" * 64)

    # ------------------------------------------------------------------
    # TR-14.1: Anonymous GET /admin/ -> 302 redirect to gate with ?next=
    # ------------------------------------------------------------------
    print("\n[TR-14.1] Anonymous GET /admin/ -> 302 gate redirect")
    resp = client.get("/admin/", follow=False)
    try:
        assert resp.status_code == 302, f"Expected 302, got {resp.status_code}"
        loc = resp.get("Location", "")
        assert "/admin/access-pass/" in loc, f"Location missing gate path: {loc}"
        assert "next=/admin/" in loc or "next=%2Fadmin%2F" in loc, f"Location missing next param: {loc}"
        print("  PASS -> redirects to gate with next param")
    except AssertionError as e:
        fail += 1
        print(f"  FAIL TR-14.1 -> {e}")

    # ------------------------------------------------------------------
    # TR-14.2: Anonymous GET /admin/access-pass/ -> 200 form renders
    # ------------------------------------------------------------------
    print("\n[TR-14.2] Anonymous GET gate page -> 200 form + csrf + access_pass input")
    resp = client.get("/admin/access-pass/")
    body = resp.content.decode("utf-8", errors="replace")
    try:
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        assert 'name="access_pass"' in body, "Missing input[name=access_pass]"
        assert "csrfmiddlewaretoken" in body, "Missing csrfmiddlewaretoken"
        assert "Admin Access Required" in body, "Missing gate heading text"
        print("  PASS -> form rendered with csrf and access_pass input")
    except AssertionError as e:
        fail += 1
        print(f"  FAIL TR-14.2 -> {e}")

    # ------------------------------------------------------------------
    # TR-14.3: Wrong pass 5x -> 6th returns 429 with lockout; session lockout_until set
    # ------------------------------------------------------------------
    print("\n[TR-14.3] Wrong pass x5 -> 6th attempt 429 lockout; session flag set")
    c2 = Client()
    c2.get("/admin/access-pass/")
    csrf_ok = False
    for i in range(1, 7):
        try:
            c2.get("/admin/access-pass/")
        except Exception:
            pass
        csrf = c2.cookies.get("csrftoken")
        csrf_val = csrf.value if csrf else ""
        data = {
            "access_pass": f"WRONG-PASS-{i}",
            "next": "/admin/",
            "csrfmiddlewaretoken": csrf_val,
        }
        headers = {"Referer": "http://testserver/admin/access-pass/"}
        try:
            resp = c2.post("/admin/access-pass/", data=data, **headers)
        except Exception as ex:
            print(f"    iter {i} post exception: {ex}")
            resp = None

        if resp is None:
            fail += 1
            print(f"  FAIL TR-14.3 iter {i} -> null response")
            continue

        if i < 5:
            try:
                assert resp.status_code == 200, f"iter{i}: Expected 200, got {resp.status_code}"
                print(f"    iter {i} wrong pass -> 200 error shown")
            except AssertionError as e:
                fail += 1
                print(f"  FAIL TR-14.3 iter{i} -> {e}")
        elif i == 5:
            try:
                assert resp.status_code == 429 or resp.status_code == 200, f"iter5 unexpected {resp.status_code}"
                session = c2.session
                attempts = session.get("_admin_pass_wrong_attempts", 0)
                print(f"    iter 5 wrong pass -> status={resp.status_code}, attempts={attempts}")
                if resp.status_code == 429:
                    lockout = session.get("_admin_pass_lockout_until", 0)
                    assert lockout > time.time(), f"iter5 lockout_until({lockout}) should be > now({time.time()})"
                    print(f"    iter 5 -> lockout_until={lockout} (in future)")
                    csrf_ok = True
            except AssertionError as e:
                fail += 1
                print(f"  FAIL TR-14.3 iter5 -> {e}")
        else:  # i == 6
            try:
                assert resp.status_code == 429, f"iter6 expected 429 lockout, got {resp.status_code}"
                session = c2.session
                lockout = session.get("_admin_pass_lockout_until", 0)
                assert lockout > time.time(), f"iter6 lockout_until({lockout}) not in future"
                remaining = int(lockout - time.time())
                assert 0 < remaining <= 15 * 60 + 2, f"iter6 remaining out of range: {remaining}"
                print(f"    iter 6 -> 429 LOCKED, ~{remaining}s remaining ({remaining//60}m{remaining%60}s)")
                csrf_ok = True
            except AssertionError as e:
                fail += 1
                print(f"  FAIL TR-14.3 iter6 -> {e}")
    if not csrf_ok:
        print("  (note: 429 confirmed via lockout at iter 5 or 6)")

    # ------------------------------------------------------------------
    # TR-14.4: Correct pass -> session flag set + redirect -> GET /admin/ 200 contains Site administration
    # ------------------------------------------------------------------
    print("\n[TR-14.4] Submit correct ADMIN_ACCESS_PASS -> session flag set + admin index 200")
    cleanup_test_users()
    admin_user = User.objects.create_superuser(
        email="tr14.admin@example.com",
        password="AdminTest123!",
        first_name="Tr14",
        last_name="Admin",
        phone_number="+900000000014",
    )
    c3 = Client()
    c3.get("/admin/access-pass/")
    csrf = c3.cookies.get("csrftoken")
    csrf_val = csrf.value if csrf else ""
    expected_pass = getattr(settings, "ADMIN_ACCESS_PASS", None) or "FYP-ADMIN-2026"
    data = {
        "access_pass": expected_pass,
        "next": "/admin/",
        "csrfmiddlewaretoken": csrf_val,
    }
    try:
        resp_post = c3.post(
            "/admin/access-pass/",
            data=data,
            Referer="http://testserver/admin/access-pass/",
        )
        assert resp_post.status_code == 302, f"Expected 302 redirect on correct pass, got {resp_post.status_code}"
        assert resp_post.get("Location", "").endswith("/admin/"), f"Redirect location expected /admin/, got {resp_post.get('Location')}"
        session = c3.session
        assert session.get("admin_access_passed_v1") is True, "Session admin_access_passed_v1 not True after correct pass"
        assert "_admin_pass_wrong_attempts" not in session, "Attempts counter not cleared after correct pass"
        print("  PASS -> correct pass sets session flag, clears attempts, redirects to /admin/")
    except AssertionError as e:
        fail += 1
        print(f"  FAIL TR-14.4 gate post -> {e}")
        admin_user.delete()
        return exit_handler(fail)

    c3.force_login(admin_user, backend="django.contrib.auth.backends.ModelBackend")
    try:
        resp_admin = c3.get("/admin/", follow=False)
        assert resp_admin.status_code == 200, f"Expected 200 admin index, got {resp_admin.status_code}"
        admin_body = resp_admin.content.decode("utf-8", errors="replace")
        assert "Site administration" in admin_body, "Admin index missing 'Site administration' text"
        print("  PASS -> superuser + pass flag: /admin/ returns 200 'Site administration' page")
    except AssertionError as e:
        fail += 1
        print(f"  FAIL TR-14.4 admin index -> {e}")

    # ------------------------------------------------------------------
    # TR-14.5: After pass granted + logged in, direct /admin/login/ -> 302 (not gate, already authed)
    # ------------------------------------------------------------------
    print("\n[TR-14.5] Pass granted -> direct /admin/login/ bypasses gate (no access-pass redirect)")
    try:
        resp_login = c3.get("/admin/login/", follow=False)
        location = resp_login.get("Location", "") or ""
        assert resp_login.status_code == 302, f"Expected 302 from admin login when authed, got {resp_login.status_code}"
        assert "/admin/access-pass/" not in location, f"Should NOT redirect to access pass gate when flag already set; Location={location}"
        assert "/admin/" in location, f"Expected redirect to /admin/ area; Location={location}"
        print(f"  PASS -> /admin/login/ -> 302 {location} (no gate bounce)")
    except AssertionError as e:
        fail += 1
        print(f"  FAIL TR-14.5 -> {e}")

    # Also: ensure middleware still protects if session flag missing
    print("\n  (extra: fresh session without flag -> /admin/login/ DOES bounce via gate)")
    c_fresh = Client()
    try:
        r = c_fresh.get("/admin/login/", follow=False)
        assert r.status_code == 302
        loc = r.get("Location", "")
        assert "/admin/access-pass/" in loc, f"Fresh session /admin/login/ should hit gate; got {loc}"
        print("  PASS -> fresh session /admin/login/ correctly bounces to gate")
    except AssertionError as e:
        fail += 1
        print(f"  FAIL (extra check) -> {e}")

    # ------------------------------------------------------------------
    # TR-14.6: Template audit grep - /admin href occurrences = 0
    # ------------------------------------------------------------------
    print("\n[TR-14.6] Template audit: grep href='/admin' in templates/**/*.html -> 0 matches")
    import re
    templates_dir = BASE_DIR / "templates"
    matches = []
    pattern = re.compile(r"href\s*=\s*[\"']\/admin")
    try:
        for html_path in templates_dir.rglob("*.html"):
            try:
                text = html_path.read_text(encoding="utf-8", errors="replace")
            except Exception:
                continue
            for lineno, line in enumerate(text.splitlines(), 1):
                if pattern.search(line):
                    matches.append((str(html_path.relative_to(BASE_DIR)), lineno, line.strip()))
        assert len(matches) == 0, f"Found {len(matches)} /admin href occurrences: {matches}"
        print(f"  PASS -> scanned {sum(1 for _ in templates_dir.rglob('*.html'))} HTML templates, 0 /admin hrefs found")
    except AssertionError as e:
        fail += 1
        print(f"  FAIL TR-14.6 -> {e}")
    except Exception as ex:
        fail += 1
        print(f"  FAIL TR-14.6 exception -> {ex}")

    cleanup_test_users()
    return exit_handler(fail)

def exit_handler(fail):
    print("\n" + "=" * 64)
    if fail == 0:
        print("=== TASK14 ALL TR PASS ===")
        print("=" * 64)
        sys.exit(0)
    else:
        print(f"=== TASK14 FAILED: {fail} assertion(s) ===")
        print("=" * 64)
        sys.exit(1)

if __name__ == "__main__":
    main()
