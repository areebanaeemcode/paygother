// [04 August 2026] Tour & App JS Module Update
document.addEventListener("DOMContentLoaded", () => {
    const otpForm = document.getElementById("otpForm");
    const otpBoxes = document.querySelectorAll(".otp-input");
    const messageBox = document.getElementById("otpMessageBox");
    const verifySubmitBtn = document.getElementById("verifySubmitBtn");
    const resendBtn = document.getElementById("resendOtpBtn");
    const timerSecondsEl = document.getElementById("timerSeconds");
    const countdownContainer = document.getElementById("countdownTimer");

    let timeLeft = 300; // 5 minutes (300s)
    let timerInterval = null;

    // ── 1. Input box navigation & paste handling ──────────
    otpBoxes.forEach((input, idx) => {
        input.addEventListener("input", (e) => {
            input.value = input.value.replace(/[^0-9]/g, "");
            if (input.value.length === 1 && idx < otpBoxes.length - 1) {
                otpBoxes[idx + 1].focus();
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && input.value === "" && idx > 0) {
                otpBoxes[idx - 1].focus();
            }
        });

        input.addEventListener("paste", (e) => {
            e.preventDefault();
            const pasted = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
            if (pasted.length >= 6) {
                otpBoxes.forEach((box, i) => {
                    box.value = pasted[i] || "";
                });
                otpBoxes[5].focus();
            }
        });
    });

    // ── 2. Countdown Timer ────────────────────────────────
    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 300;
        updateTimerDisplay();

        resendBtn.classList.add("opacity-50", "pointer-events-none");
        countdownContainer.classList.remove("text-rose-600", "border-rose-300", "bg-rose-50");

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerSecondsEl.textContent = "Expired";
                countdownContainer.classList.add("text-rose-600", "border-rose-300", "bg-rose-50");
                resendBtn.classList.remove("opacity-50", "pointer-events-none");
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
        const secs = String(timeLeft % 60).padStart(2, "0");
        timerSecondsEl.textContent = `${mins}:${secs}`;
    }

    startTimer();

    // ── Auto-Fill Handler ──────────────────────────────────
    const autoFillBtn = document.getElementById("autoFillBtn");
    const debugOtpValEl = document.getElementById("debugOtpValue");
    if (autoFillBtn && debugOtpValEl) {
        autoFillBtn.addEventListener("click", () => {
            const raw = debugOtpValEl.textContent.trim().replace(/\D/g, "");
            if (raw.length === 6) {
                otpBoxes.forEach((box, i) => {
                    box.value = raw[i] || "";
                });
                otpBoxes[5].focus();
                showMsg("Code auto-filled! Click 'Verify & Complete Registration' below.", "green");
            }
        });
    }

    // ── 3. Resend OTP ──────────────────────────────────────
    resendBtn.addEventListener("click", async () => {
        resendBtn.disabled = true;
        resendBtn.textContent = "Sending...";

        try {
            const resp = await fetch("/client/api/register/resend-otp/", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            const data = await resp.json();

            if (resp.ok) {
                showMsg(data.message || "New OTP has been sent to your email!", "green");
                otpBoxes.forEach(b => b.value = "");
                otpBoxes[0].focus();
                if ((data.otp_code || data.otp_preview) && debugOtpValEl) {
                    debugOtpValEl.textContent = data.otp_code || data.otp_preview;
                }
                startTimer();
            } else {
                showMsg(data.detail || "Could not resend OTP. Please try again.", "red");
                resendBtn.classList.remove("opacity-50", "pointer-events-none");
            }
        } catch (err) {
            console.error(err);
            showMsg("Network error sending OTP. Please try again.", "red");
            resendBtn.classList.remove("opacity-50", "pointer-events-none");
        } finally {
            resendBtn.disabled = false;
            resendBtn.textContent = "Resend OTP";
        }
    });

    // ── 4. Verify & Register Form Submit ──────────────────
    otpForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        messageBox.innerHTML = "";

        let enteredCode = "";
        otpBoxes.forEach(box => enteredCode += box.value.trim());

        if (enteredCode.length !== 6) {
            showMsg("Please enter the complete 6-digit OTP code.", "red");
            return;
        }

        const originalBtnHTML = verifySubmitBtn.innerHTML;
        verifySubmitBtn.disabled = true;
        verifySubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Verifying...`;

        try {
            const resp = await fetch("/client/api/register/verify-otp/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp: enteredCode })
            });

            const data = await resp.json();

            if (resp.ok) {
                showMsg("Verification successful! Account created. Redirecting to login...", "green");
                setTimeout(() => {
                    window.location.href = data.redirect_url || "/login/";
                }, 1200);
            } else {
                showMsg(data.detail || "Invalid or expired OTP code. Please try again.", "red");
                verifySubmitBtn.disabled = false;
                verifySubmitBtn.innerHTML = originalBtnHTML;
            }
        } catch (err) {
            console.error(err);
            showMsg("Server error during verification. Please try again.", "red");
            verifySubmitBtn.disabled = false;
            verifySubmitBtn.innerHTML = originalBtnHTML;
        }
    });

    function showMsg(text, type) {
        const bg = type === "green" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200";
        messageBox.innerHTML = `
            <div class="p-3.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 ${bg}">
                <i class="fa-solid ${type === 'green' ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation text-rose-600'}"></i>
                <span>${text}</span>
            </div>
        `;
    }
});
