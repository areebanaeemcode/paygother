from django.urls import path

from .views import (
    RegisterPageView,
    VerifyOTPPageView,
    LoginPageView,
    LandingPageView,
)

urlpatterns = [
    path("register/", RegisterPageView.as_view(), name="register-page"),
    path("register/verify-otp/", VerifyOTPPageView.as_view(), name="verify-otp-page"),
    path("login/", LoginPageView.as_view(), name="login-page"),
    path("", LandingPageView.as_view(), name="landing-page"),
]

