"""Task 6 TR scenario (Receipt upload)."""
import os
import sys
import io
from decimal import Decimal
from datetime import date

BASE_DIR = r"c:\Users\muham\Downloads\FYP (1)\FYP"
sys.path.insert(0, BASE_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
import django
django.setup()

from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.tours.models import Tour, TourMember
from apps.expenses.models import Expense, ExpenseSplit, Receipt

User = get_user_model()


def fresh_phone(prefix, i):
    return f"+9990006{prefix}{i:02d}"


def auth_client(user):
    refresh = RefreshToken.for_user(user)
    c = APIClient()
    c.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return c


def make_png_bytes(size_kb=1):
    # Minimal valid PNG (IHDR+IDAT+IEND chunks); header 8 bytes
    # This has image dimensions 1x1 with IDAT data; valid PNG
    header = b'\x89PNG\r\n\x1a\n'
    ihdr_len = b'\x00\x00\x00\x0d'
    ihdr_type = b'IHDR'
    ihdr_data = b'\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00'
    ihdr_crc = (
        zlib_crc32(ihdr_type + ihdr_data).to_bytes(4, 'big')
    )
    raw = b'\x00\xff\x00\x00\x00'
    compressed = zlib_compress(raw)
    idat_len = len(compressed).to_bytes(4, 'big')
    idat_type = b'IDAT'
    idat_crc = zlib_crc32(idat_type + compressed).to_bytes(4, 'big')
    iend_len = b'\x00\x00\x00\x00'
    iend_type = b'IEND'
    iend_crc = zlib_crc32(iend_type).to_bytes(4, 'big')
    base = (
        header + ihdr_len + ihdr_type + ihdr_data + ihdr_crc
        + idat_len + idat_type + compressed + idat_crc
        + iend_len + iend_type + iend_crc
    )
    if size_kb > 0 and len(base) < size_kb * 1024:
        # pad by appending more IDAT chunks? Simpler: grow inside IDAT by adding repeated compressed bytes
        # Actually simpler: pad via ancillary tEXt chunks, but easier: make image larger
        # Alternative: append padding to `base` to reach size_kb (invalid PNG but forms.ImageField
        # passes size/content_type checks without verifying CRC via our stubs). PIL stub accepts anything.
        # So use a safer approach: just build a 1x1 then repeat bytes
        needed = max(0, size_kb * 1024 - len(base))
        base += b'\x00' * needed
    return base


def zlib_compress(data):
    import zlib
    return zlib.compress(data)


def zlib_crc32(data):
    import zlib
    return zlib.crc32(data) & 0xffffffff


def run():
    emails = [
        ("t6a_last", "t6a@example.com", fresh_phone("A", 1)),
        ("t6b_last", "t6b@example.com", fresh_phone("A", 2)),
        ("t6out_last", "t6out@example.com", fresh_phone("A", 9)),
    ]
    users = []
    for (ln, em, ph) in emails:
        u, _ = User.objects.get_or_create(
            email=em,
            defaults={
                "first_name": f"T6User{len(users)+1}",
                "last_name": ln,
                "phone_number": ph,
                "is_active": True,
            },
        )
        u.set_password("T6pass_123")
        u.save(update_fields=["password"])
        users.append(u)
    uA, uB, uOut = users

    # clear old
    TourMember.objects.filter(user__in=users).delete()
    Expense.objects.filter(tour__memberships__user__in=users).delete()

    tour = Tour.objects.create(
        title="Task 6 Test Tour",
        destination="T6 Test Loc",
        budget=Decimal("1000.00"),
        start_date=date(2026, 9, 1),
        end_date=date(2026, 9, 10),
        created_by=uA,
    )
    TourMember.objects.create(tour=tour, user=uA, role="creator")
    TourMember.objects.create(tour=tour, user=uB, role="member")

    # create one expense paid by uA
    exp = Expense.objects.create(
        tour=tour, title="Receipt expense", amount=Decimal("60.00"),
        category="food", payment_method="cash",
        paid_by=uA, created_by=uA,
    )
    for (uid, share) in [(uA.id, "40.00"), (uB.id, "20.00")]:
        ExpenseSplit.objects.create(expense=exp, user_id=uid, share_amount=Decimal(share))

    cA = auth_client(uA)
    cB = auth_client(uB)
    cOut = auth_client(uOut)

    fail = 0

    # TR-6.1: outsider upload -> 403
    small_png = make_png_bytes(10)
    suf = SimpleUploadedFile("test.png", small_png, content_type="image/png")
    r = cOut.post(f"/client/expenses/api/{exp.id}/receipt/", {"image": suf}, format="multipart")
    if r.status_code != 403:
        print(f"TR-6.1 FAIL outsider upload status={r.status_code} body={r.content[:200]!r}")
        fail += 1
    else:
        print("TR-6.1 PASS (outsider upload -> 403)")

    # TR-6.2: size > 5MB -> 400
    big_png = make_png_bytes(6 * 1024)  # 6MB
    suf_big = SimpleUploadedFile("big.png", big_png, content_type="image/png")
    r = cA.post(f"/client/expenses/api/{exp.id}/receipt/", {"image": suf_big}, format="multipart")
    if r.status_code != 400:
        print(f"TR-6.2 FAIL big upload status={r.status_code}")
        fail += 1
    else:
        print("TR-6.2 PASS (>5MB -> 400)")

    # TR-6.3: invalid format (.txt) -> 400
    txt_bytes = b'not an image' * 20
    suf_txt = SimpleUploadedFile("bad.txt", txt_bytes, content_type="text/plain")
    r = cA.post(f"/client/expenses/api/{exp.id}/receipt/", {"image": suf_txt}, format="multipart")
    if r.status_code != 400:
        print(f"TR-6.3 FAIL txt upload status={r.status_code} body={r.content[:200]!r}")
        fail += 1
    else:
        print("TR-6.3 PASS (txt format -> 400)")

    # TR-6.4: valid PNG (<5MB) member upload -> 201, receipt created + verified_by first user
    suf_good = SimpleUploadedFile("good.png", make_png_bytes(20), content_type="image/png")
    r = cA.post(f"/client/expenses/api/{exp.id}/receipt/", {"image": suf_good}, format="multipart")
    if r.status_code not in (201, 200):
        print(f"TR-6.4 FAIL good upload status={r.status_code} body={r.content[:400]!r}")
        fail += 1
    else:
        d = r.data
        r_info = d.get("receipt")
        if not r_info or not r_info.get("url"):
            print("TR-6.4 FAIL receipt url missing in response")
            fail += 1
        else:
            db_receipt = Receipt.objects.filter(expense=exp).first()
            if not db_receipt:
                print("TR-6.4 FAIL receipt DB row missing")
                fail += 1
            elif db_receipt.verified_by_id != uA.id:
                print(f"TR-6.4 FAIL verified_by={db_receipt.verified_by_id} expected={uA.id}")
                fail += 1
            elif db_receipt.verified_at is None:
                print("TR-6.4 FAIL verified_at empty")
                fail += 1
            else:
                print(f"TR-6.4 PASS (valid upload {r.status_code} + verified_by first uploader)")

    # TR-6.5: Verify endpoint (different member)
    # First, we need an expense whose receipt exists but verified_by is null. Simulate by clearing.
    exp2 = Expense.objects.create(
        tour=tour, title="Verify test expense", amount=Decimal("25.00"),
        category="transport", payment_method="card",
        paid_by=uB, created_by=uB,
    )
    for (uid, share) in [(uA.id, "10.00"), (uB.id, "15.00")]:
        ExpenseSplit.objects.create(expense=exp2, user_id=uid, share_amount=Decimal(share))
    # uB upload -> verified_by = uB (first upload). Then manually reset verified to None.
    suf_v = SimpleUploadedFile("rv.png", make_png_bytes(15), content_type="image/png")
    r = cB.post(f"/client/expenses/api/{exp2.id}/receipt/", {"image": suf_v}, format="multipart")
    assert r.status_code in (200, 201), f"preset upload failed {r.status_code}"
    receipt2 = Receipt.objects.get(expense=exp2)
    receipt2.verified_by = None
    receipt2.verified_at = None
    receipt2.save(update_fields=["verified_by", "verified_at"])

    r_ver = cA.post(f"/client/expenses/api/{exp2.id}/receipt/verify/", {}, format="json")
    if r_ver.status_code != 200:
        print(f"TR-6.5 FAIL verify status={r_ver.status_code} body={r_ver.content[:200]!r}")
        fail += 1
    else:
        receipt2.refresh_from_db()
        if receipt2.verified_by_id != uA.id or receipt2.verified_at is None:
            print(f"TR-6.5 FAIL verify DB state verified_by={receipt2.verified_by_id} verified_at={receipt2.verified_at}")
            fail += 1
        else:
            print("TR-6.5 PASS (verify endpoint sets verified_by/verified_at)")

    # TR-6.6: Verify outsider -> 403
    r_ver_out = cOut.post(f"/client/expenses/api/{exp2.id}/receipt/verify/", {}, format="json")
    if r_ver_out.status_code != 403:
        print(f"TR-6.6 FAIL outsider verify status={r_ver_out.status_code}")
        fail += 1
    else:
        print("TR-6.6 PASS (outsider verify -> 403)")

    if fail == 0:
        print("=== TASK 6 ALL TR EVIDENCE PASS ===")
        return 0
    print(f"=== TASK 6 FAILURES: {fail} ===")
    return 1


if __name__ == "__main__":
    sys.exit(run())
