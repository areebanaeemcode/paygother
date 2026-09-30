import os, sys, django
sys.path.insert(0, '.')
sys.path.insert(0, 'stdlib_stubs')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from django.urls import resolve, Resolver404
from apps.tours.models import Tour, TourMember
import json
from datetime import date

User = get_user_model()

def mk_user(tag, idx):
    email = 'tr.tour' + tag + '.u' + str(idx) + '@pay-together.dev'
    phone = '+987000000' + f'{idx:02d}' + tag
    try:
        u = User.objects.get(email=email)
        if not u.check_password('TourPass2026!'):
            u.set_password('TourPass2026!')
            u.save(update_fields=['password'])
    except User.DoesNotExist:
        u = User.objects.create_user(
            email=email,
            password='TourPass2026!',
            first_name='Tr' + tag.capitalize(),
            last_name='U' + str(idx),
            phone_number=phone,
        )
    return u

admin_u = mk_user('mem', 1)
bob = mk_user('mem', 2)
charlie = mk_user('mem', 3)
diana = mk_user('mem', 4)
non_member_u = mk_user('mem', 5)

Tour.objects.filter(created_by=admin_u).delete()

c_admin = Client(enforce_csrf_checks=False)
ok_login = c_admin.login(email=admin_u.email, password='TourPass2026!')
assert ok_login, 'admin login failed'

print('=' * 60)
print('TR: Tour Member Invite + Remove + Permission Gates')
print('=' * 60)
total_tests = 0
passed = 0
failed = 0

def check(name, cond, detail=''):
    global total_tests, passed, failed
    total_tests += 1
    mark_ok = cond
    status = 'PASS' if mark_ok else 'FAIL'
    tag = 'OK' if mark_ok else 'XX'
    line = '[%02d] %s  %s  %s' % (total_tests, tag, status, name)
    if detail and not mark_ok:
        line += '  ' + str(detail)
    print(line)
    if mark_ok:
        passed += 1
    else:
        failed += 1

new_tour = Tour.objects.create(
    created_by=admin_u,
    title='Member TR Tour',
    destination='Lahore',
    budget='1000.00',
    start_date=date(2026, 12, 1),
    end_date=date(2026, 12, 10),
    status='planned',
)
TourMember.objects.get_or_create(tour=new_tour, user=admin_u, defaults={'role': 'creator'})
tour_id = new_tour.pk
s0 = TourMember.objects.filter(tour=new_tour, user=admin_u, role='creator').exists()
check('S0 Create tour + creator TourMember', s0)

TourMember.objects.get_or_create(tour_id=tour_id, user=charlie, defaults={'role':'member'})

c_bob = Client(enforce_csrf_checks=False)
assert c_bob.login(email=bob.email, password='TourPass2026!'), 'bob login'

c_non = Client(enforce_csrf_checks=False)
assert c_non.login(email=non_member_u.email, password='TourPass2026!'), 'non_member login'

print()
print('--- DEBUG: Resolve URL inside Django test ---')
debug_paths = [
    '/client/tours/api/' + str(tour_id) + '/invite/',
    '/client/tours/api/' + str(tour_id) + '/remove-member/',
]
for p in debug_paths:
    try:
        m = resolve(p)
        fn = getattr(m.func, '__name__', repr(m.func))
        print('  OK:', p, '->', fn, 'kwargs=', m.kwargs)
    except Resolver404:
        print('  404:', p)

print()
print('--- Scenario 1: Admin invites existing Bob by EMAIL ---')
invite_url = '/client/tours/api/' + str(tour_id) + '/invite/'
r1 = c_admin.post(invite_url, data=json.dumps({'identifier': bob.email}), content_type='application/json')
print('  HTTP status:', r1.status_code, 'Content-Type:', r1.get('Content-Type', '?'))
print('  Response body (first 1000 chars):')
try:
    print((r1.content or b'').decode('utf-8', errors='replace')[:1000])
except Exception as _e:
    print('  COULD NOT DECODE:', _e)
r1b = {}
if r1.content:
    try:
        r1b = json.loads(r1.content)
    except Exception:
        r1b = {}
check('S1a Invite existing user -> 200', r1.status_code == 200, 'got ' + str(r1.status_code))
check('S1b Response state=added created=True',
      r1b.get('state') == 'added' and r1b.get('created') is True,
      'state=' + str(r1b.get('state')) + ' created=' + str(r1b.get('created')))
check('S1c Bob now TourMember in DB', TourMember.objects.filter(tour_id=tour_id, user=bob).exists())
if TourMember.objects.filter(tour_id=tour_id, user=bob).exists():
    check('S1d Bob member role=member', TourMember.objects.get(tour_id=tour_id, user=bob).role == 'member')
else:
    total_tests += 1; failed += 1; print('[%02d] XX  FAIL  S1d skipped (Bob not added)' % total_tests)

print()
print('--- Scenario 2: Admin invites same user again -> idempotent already_member ---')
r2 = c_admin.post(invite_url, data=json.dumps({'identifier': bob.email}), content_type='application/json')
r2b = json.loads(r2.content) if r2.content else {}
check('S2a Re-invite existing Bob -> 200', r2.status_code == 200)
check('S2b Response state=already_member + created=False',
      r2b.get('state') == 'already_member' and r2b.get('created') is False,
      'state=' + str(r2b.get('state')) + ' created=' + str(r2b.get('created')))
check('S2c Still exactly 1 TourMember row for Bob',
      TourMember.objects.filter(tour_id=tour_id, user=bob).count() == 1)

print()
print('--- Scenario 3: NON-REGISTERED email invite -> 404 user_not_found hint ---')
r3 = c_admin.post(invite_url,
                  data=json.dumps({'identifier': 'definitely.not.registered.tourtr@pay-together.dev.invalid'}),
                  content_type='application/json')
r3b = json.loads(r3.content) if r3.content else {}
check('S3a Unknown email -> 404', r3.status_code == 404, 'got ' + str(r3.status_code))
msg3 = (r3b.get('message') or '').lower()
check('S3b state=user_not_found + tells sign up',
      r3b.get('state') == 'user_not_found' and 'sign up' in msg3,
      'state=' + str(r3b.get('state')) + ' msg=' + str(r3b.get('message')))

print()
print('--- Scenario 4: Admin gates (Bob non-admin tries remove = 403) ---')
remove_url = '/client/tours/api/' + str(tour_id) + '/remove-member/'
r4b = c_bob.post(remove_url,
                 data=json.dumps({'user_id': charlie.pk}),
                 content_type='application/json')
check('S4a Non-admin Bob remove Charlie -> 403 PERM DENIED',
      r4b.status_code == 403,
      'got ' + str(r4b.status_code))
check('S4b Charlie still a member (not actually removed)',
      TourMember.objects.filter(tour_id=tour_id, user=charlie).exists())

r4d = c_non.post(invite_url,
                 data=json.dumps({'identifier': diana.email}),
                 content_type='application/json')
check('S4c Total outsider (no tour membership) invite -> 403',
      r4d.status_code == 403,
      'got ' + str(r4d.status_code))

print()
print('--- Scenario 5: Admin REMOVE Charlie ---')
r5 = c_admin.post(remove_url,
                  data=json.dumps({'user_id': charlie.pk}),
                  content_type='application/json')
r5b = json.loads(r5.content) if r5.content else {}
check('S5a Admin remove Charlie -> 200', r5.status_code == 200, 'got ' + str(r5.status_code))
check('S5b removed=True + DB confirms Charlie no longer member',
      r5b.get('removed') is True and not TourMember.objects.filter(tour_id=tour_id, user=charlie).exists(),
      'removed=' + str(r5b.get('removed')) + ' db=' + str(TourMember.objects.filter(tour_id=tour_id, user=charlie).exists()))

print()
print('--- Scenario 6: Admin role safety gates ---')
r6a = c_admin.post(remove_url,
                   data=json.dumps({'user_id': admin_u.pk}),
                   content_type='application/json')
check('S6a Admin remove SELF (creator) -> 400 rejected', r6a.status_code == 400, 'got ' + str(r6a.status_code))
r6b = c_admin.post(remove_url,
                   data=json.dumps({'user_id': non_member_u.pk}),
                   content_type='application/json')
check('S6b Admin remove never-member user -> 404', r6b.status_code == 404, 'got ' + str(r6b.status_code))
r6c = c_admin.post(remove_url,
                   data=json.dumps({'user_id': 'not-a-number'}),
                   content_type='application/json')
check('S6c Remove with non-int user_id -> 400 rejected', r6c.status_code == 400, 'got ' + str(r6c.status_code))

# Admin page UI
r6d = c_admin.get('/client/tours/' + str(tour_id) + '/')
check('S6d Admin tour detail page 200', r6d.status_code == 200, 'got ' + str(r6d.status_code))
html6d = r6d.content.decode('utf-8', errors='replace') if r6d.content else ''
has_admin_btn = 'id="addMemberBtn"' in html6d
check('S6e Page contains admin-only Add Member button (creator=admin sees it)', has_admin_btn)
has_add_member_modal = 'id="addMemberModal"' in html6d
check('S6f Page has Add Member modal markup', has_add_member_modal)

r6e = c_bob.get('/client/tours/' + str(tour_id) + '/')
check('S6g Non-admin Bob tour detail page 200', r6e.status_code == 200, 'got ' + str(r6e.status_code))
html6e = r6e.content.decode('utf-8', errors='replace') if r6e.content else ''
bob_has_admin_btn = 'id="addMemberBtn"' in html6e
check('S6h Bob page MUST NOT contain Add Member button (admin-only UI gate)', not bob_has_admin_btn)

print()
print('=' * 60)
print('RESULTS: %d/%d passed  (%d failed)' % (passed, total_tests, failed))
print('=' * 60)

# Cleanup
Tour.objects.filter(pk=tour_id).delete()
for u in (admin_u, bob, charlie, diana, non_member_u):
    try:
        TourMember.objects.filter(user=u).delete()
        u.delete()
    except Exception:
        pass

if failed == 0:
    print('ALL SCENARIOS PASS. Member invite + remove working.')
    sys.exit(0)
else:
    print('Some scenarios FAILED. See above.')
    sys.exit(1)
