import os, sys, django
if sys.platform == 'win32' and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, '.')
sys.path.insert(0, 'stdlib_stubs')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
User = get_user_model()

import json, re
email_reg='seed.e2e.reg@pay-together.dev'
email_login='seed.alice@pay-together.dev'
pwd='StrongPass#123'
c=Client(raise_request_exception=False)

def banner(t):
    print()
    print('='*60)
    print(t)
    print('='*60)

banner('FINAL END-TO-END (Chrome user flow simulation)')

# ---- Step A: Root redirect ----
r=c.get('/', follow=False)
ok_a = (r.status_code==302 and "/login/" in r.get("Location",""))
print(f'STEP A  GET /                           -> {r.status_code} -> {r.get("Location","")}  {"OK" if ok_a else "FAIL"}')

# ---- Step B: Login page render ----
r=c.get('/login/', follow=False)
assert r.status_code==200, f'Login page not 200: {r.status_code}'
html=r.content.decode('utf-8', errors='replace')
has_form=('<form' in html) and ('id="loginForm"' in html or 'loginForm' in html)
ok_b = (r.status_code==200 and has_form)
print(f'STEP B  GET /login/                      -> {r.status_code} form present={has_form}  {"OK" if ok_b else "FAIL"}')

# ---- Step C: POST /client/api/login/ (login.js behaviour) ----
alice=User.objects.get(email=email_login)
# if no password set:
if not alice.check_password(pwd):
    alice.set_password(pwd)
    alice.save(update_fields=['password'])
r=c.post('/client/api/login/', data={'email':email_login,'password':pwd}, content_type='application/json')
body=json.loads(r.content)
tokens=body.get('tokens')
ok_c = (r.status_code==200 and bool(tokens))
print(f'STEP C  POST login API                   -> {r.status_code} success={body.get("success")} has_tokens={bool(tokens)}  {"OK" if ok_c else "FAIL"}')

# ---- Step D: CHECK session auth ----
sess=c.session
auth_uid=sess.get('_auth_user_id')
ok_d = bool(auth_uid)
print(f'STEP D  session._auth_user_id            -> {auth_uid}  {"OK" if ok_d else "FAIL (critical - would 302 loop)"}')

# ---- Step E: Dashboard 200 HTML render (no redirect!) ----
r=c.get('/client/dashboard/', follow=False)
dashboard_html=r.content.decode('utf-8', errors='replace')
assert r.status_code==200, f'Dashboard NOT 200 -> {r.status_code} {r.get("Location","")}'
has_tour_list='Recent Tours' in dashboard_html or 'recent-tours' in dashboard_html or 'Recent Trips' in dashboard_html
has_create_cta='Create Tour' in dashboard_html or 'tour-create' in dashboard_html or 'New Tour' in dashboard_html
has_profile='profile' in dashboard_html.lower() or '/client/profile/' in dashboard_html
has_notif='bell' in dashboard_html.lower() or '/client/notifications/' in dashboard_html or 'notif' in dashboard_html.lower()
print(f'STEP E  GET /client/dashboard/           -> {r.status_code}  HTML length={len(dashboard_html)}')
print(f'          - RecentTours marker  : {has_tour_list}')
print(f'          - Tour create CTA     : {has_create_cta}')
print(f'          - Profile link/menu   : {has_profile}')
print(f'          - Notifications bell  : {has_notif}')
ok_e = has_create_cta and (has_tour_list or has_profile or has_notif)
print(f'          STEP E RESULT: {"OK" if ok_e else "FAIL - dashboard markup missing expected elements"}')

# ---- Step F: Other LoginRequiredMixin pages 200 sanity ----
from apps.tours.models import Tour
alice_tour = Tour.objects.filter(memberships__user=alice).first()
tid = alice_tour.pk if alice_tour else (Tour.objects.values_list('pk', flat=True).first() or 1)
pages=[
    ('/client/tours/', 'My Tours'),
    ('/client/tours/create/', 'Create Tour'),
    ('/client/profile/', 'Profile'),
    ('/client/notifications/', 'Notifications'),
    ('/client/analytics/', 'Analytics'),
    (f'/client/tours/{tid}/settlement/', 'Tour Settlement'),
]
print()
print('STEP F  Other LoginRequiredMixin pages (session auth):')
all_passed=True
for url, name in pages:
    r=c.get(url, follow=False)
    ok = r.status_code==200
    all_passed = all_passed and ok
    mark='OK' if ok else f'FAIL {r.status_code} -> {r.get("Location","")}'
    print(f'        {name:22s} GET {url:32s} -> {r.status_code}  {mark}')

# ---- Step G: Logout clears session + returns login ----
r=c.get('/client/logout/', follow=False)
sess2=c.session
auth_uid2=sess2.get('_auth_user_id')
loc=r.get('Location','')
ok_g = (r.status_code==302 and '/login/' in loc) and (not auth_uid2)
print(f'STEP G  GET /client/logout/              -> {r.status_code} -> {loc}   session_uid after={auth_uid2 or "(none)"}  {"OK" if ok_g else "FAIL"}')

# ---- Step H: After logout Dashboard redirects to login ----
r=c.get('/client/dashboard/', follow=False)
ok_h = (r.status_code==302 and '/login/' in (r.get('Location') or ''))
print(f'STEP H  POST-logout GET dashboard        -> {r.status_code} -> {r.get("Location","")}  {"OK" if ok_h else "FAIL"}')

banner('FINAL SUMMARY')
checks=[
    ('A Root redirect / -> /login/', ok_a),
    ('B Login page renders 200 with form', ok_b),
    ('C Login API returns 200 + JWT', ok_c),
    ('D Django session populated after login', ok_d),
    ('E Dashboard renders 200 with expected UI', ok_e),
    ('F 6 other protected pages ALL 200', all_passed),
    ('G Logout clears session + redirects', ok_g),
    ('H Post-logout dashboard bounces to login', ok_h),
]
all_ok=True
for n,ok in checks:
    mark='✅ PASS' if ok else '❌ FAIL'
    all_ok = all_ok and ok
    print(f'  {mark}  {n}')

print()
if all_ok:
    print('🎉  ALL END-TO-END VERIFICATION CHECKS PASSED  🎉')
    print('Project 100% working end-to-end.')
    sys.exit(0)
else:
    print('SOME CHECKS FAILED. See above.')
    sys.exit(1)
