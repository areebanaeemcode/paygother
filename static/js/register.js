// [03 August 2026] Tour & App JS Module Update
const registerForm = document.getElementById("registerForm");
const messageBox = document.getElementById("message");

registerForm.addEventListener("submit", registerUser);

async function registerUser(event) {

    event.preventDefault();

    messageBox.innerHTML = "";

    const first_name = document.getElementById("first_name").value.trim();
    const last_name = document.getElementById("last_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone_number = document.getElementById("phone_number").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm_password = document.getElementById("confirm_password").value.trim();

    // Empty Fields Validation
    if (
        first_name === "" ||
        last_name === "" ||
        email === "" ||
        phone_number === "" ||
        password === "" ||
        confirm_password === ""
    ) {
        showMessage("Please fill all required fields.", "red");
        return;
    }

    // Password Match Validation
    if (password !== confirm_password) {
        showMessage("Passwords do not match.", "red");
        return;
    }

    const submitBtn = document.getElementById("registerSubmitBtn");
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "Create Account &amp; Send OTP";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sending OTP...`;
    }

    try {

        const response = await fetch("/client/api/register/send-otp/", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                first_name,
                last_name,
                email,
                phone_number,
                password,
                confirm_password
            })
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { detail: "Server returned an unexpected response. Please try again." };
        }

        if (response.ok) {

            showMessage(data.message || "OTP code sent to your email! Redirecting...", "green");

            setTimeout(() => {
                window.location.href = data.redirect_url || "/register/verify-otp/";
            }, 800);

        } else {

            displayErrors(data);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }

        }

    } catch (error) {

        console.error(error);

        showMessage(
            "Server Error. Please try again later.",
            "red"
        );
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    }

}

// Success / Error Message
function showMessage(message, color) {

    messageBox.innerHTML = `
        <div class="p-3 rounded-lg text-white bg-${color}-500">
            ${message}
        </div>
    `;

}

// Django Errors
function displayErrors(errors) {

    let html = "";

    if (typeof errors.detail === "string") {
        html += `
            <p class="text-red-600 font-medium">
                ${errors.detail}
            </p>
        `;
    } else {
        for (let field in errors) {
            const val = errors[field];
            const msg = Array.isArray(val) ? val[0] : val;
            html += `
                <p class="text-red-600 font-medium">
                    ${field}: ${msg}
                </p>
            `;
        }
    }

    messageBox.innerHTML = html;

}