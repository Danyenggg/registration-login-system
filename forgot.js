
emailjs.init({
    publicKey: "x26uA0Cqaligbqqil"
});

var verifiedUsername = "";
var verifiedEmail = "";
var generatedOTP = "";
var otpExpiry = 0;
var otpAttempts = 0;
var otpVerified = false;

var accountInput = document.getElementById("account");
var otpInput = document.getElementById("otp");
var newPasswordInput = document.getElementById("newPassword");
var confirmPasswordInput = document.getElementById("confirmPassword");
var confirmGroup = document.getElementById("forgotConfirmGroup");

var message = document.getElementById("message");
var continueButton = document.getElementById("continueButton");
var verifyOTPButton = document.getElementById("verifyOTPButton");
var otpSection = document.getElementById("otpSection");
var resetSection = document.getElementById("resetPassword");

var passwordRequirements = {
    length: document.getElementById("forgot-length"),
    upper: document.getElementById("forgot-upper"),
    lower: document.getElementById("forgot-lower"),
    number: document.getElementById("forgot-number"),
    special: document.getElementById("forgot-special")
};

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}

function generateOTP() {
    var values = new Uint32Array(1);
    crypto.getRandomValues(values);

    return String(values[0] % 1000000).padStart(6, "0");
}

function checkPassword(password) {
    return {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9\s]/.test(password)
    };
}

function isStrongPassword(password) {
    var result = checkPassword(password);

    return result.length &&
        result.upper &&
        result.lower &&
        result.number &&
        result.special;
}

function updatePasswordRequirements() {
    var password = newPasswordInput.value;
    var result = checkPassword(password);

    Object.keys(passwordRequirements).forEach(function (key) {
        var item = passwordRequirements[key];

        item.classList.remove("valid", "invalid");

        if (password.length > 0) {
            item.classList.add(result[key] ? "valid" : "invalid");
        }
    });

    if (password.length > 0) {
        confirmGroup.style.display = "block";
        confirmPasswordInput.disabled = false;
        confirmPasswordInput.required = true;
    } else {
        confirmGroup.style.display = "none";
        confirmPasswordInput.disabled = true;
        confirmPasswordInput.required = false;
        confirmPasswordInput.value = "";
    }
}

newPasswordInput.addEventListener("input", updatePasswordRequirements);

async function verifyAccount() {
    var account = accountInput.value.trim();
    var savedUsername = localStorage.getItem("username");
    var savedEmail = localStorage.getItem("email");

    resetSection.style.display = "none";
    otpSection.style.display = "none";

    if (!account) {
        showMessage("Please enter your username or email.", "red");
        return;
    }

    if (!savedUsername || !savedEmail) {
        showMessage(
            "No registered account or email was found on this browser.",
            "red"
        );
        return;
    }

    var accountMatches =
        account.toLowerCase() === savedUsername.toLowerCase() ||
        account.toLowerCase() === savedEmail.toLowerCase();

    if (!accountMatches) {
        showMessage("Account not found.", "red");
        return;
    }

    verifiedUsername = savedUsername;
    verifiedEmail = savedEmail;

    generatedOTP = generateOTP();
    otpExpiry = Date.now() + 10 * 60 * 1000;
    otpAttempts = 0;
    otpVerified = false;

    otpInput.value = "";
    continueButton.disabled = true;

    showMessage("Sending your verification code...", "black");

    try {
        await emailjs.send(
            "service_ip63ui5",
            "template_bqh5bjo",
            {
                username: verifiedUsername,
                email: verifiedEmail,
                otp: generatedOTP
            }
        );

        otpSection.style.display = "block";
        showMessage(
            "A 6-digit verification code was sent to your registered email. It expires in 10 minutes.",
            "green"
        );

        otpInput.focus();
    } catch (error) {
        // Invalidate the code if the email could not be sent.
        generatedOTP = "";
        otpExpiry = 0;

        console.error("EmailJS error:", error);

        showMessage(
            "Could not send the email. Please check your connection and try again.",
            "red"
        );
    } finally {
        continueButton.disabled = false;
    }
}

function verifyOTP() {
    var enteredOTP = otpInput.value.trim();

    if (!generatedOTP || !verifiedEmail) {
        showMessage("Please request a verification code first.", "red");
        return;
    }

    if (Date.now() > otpExpiry) {
        generatedOTP = "";
        otpVerified = false;
        otpSection.style.display = "none";

        showMessage(
            "Your verification code has expired. Please request a new one.",
            "red"
        );
        return;
    }

    if (otpAttempts >= 5) {
        generatedOTP = "";
        otpVerified = false;
        otpSection.style.display = "none";

        showMessage(
            "Too many incorrect attempts. Please request a new code.",
            "red"
        );
        return;
    }

    if (!/^\d{6}$/.test(enteredOTP)) {
        showMessage("Enter the complete 6-digit verification code.", "red");
        return;
    }

    if (enteredOTP !== generatedOTP) {
        otpAttempts++;

        var remaining = 5 - otpAttempts;

        if (remaining <= 0) {
            generatedOTP = "";
            otpVerified = false;
            otpSection.style.display = "none";

            showMessage(
                "Too many incorrect attempts. Please request a new code.",
                "red"
            );
        } else {
            showMessage(
                "Incorrect code. Attempts remaining: " + remaining,
                "red"
            );
        }

        return;
    }

    otpVerified = true;
    generatedOTP = "";
    otpExpiry = 0;
    otpSection.style.display = "none";
    resetSection.style.display = "block";

    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
    updatePasswordRequirements();

    showMessage(
        "Email verified! You can now create your new password.",
        "green"
    );

    newPasswordInput.focus();
}

function changePassword() {
    var newPassword = newPasswordInput.value;
    var confirmPassword = confirmPasswordInput.value;

    if (!otpVerified || !verifiedUsername || !verifiedEmail) {
        showMessage(
            "Please verify the email code before resetting your password.",
            "red"
        );
        return;
    }

    if (!newPassword) {
        showMessage("Please create a new password.", "red");
        return;
    }

    if (!isStrongPassword(newPassword)) {
        showMessage(
            "Password must have at least 8 characters, uppercase and lowercase letters, a number, and a special character.",
            "red"
        );
        return;
    }

    if (!confirmPassword) {
        showMessage("Please re-enter your password.", "red");
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage("Passwords do not match.", "red");
        return;
    }

    // Matches the localStorage password key used by this project.
    localStorage.setItem("password", newPassword);

    // Prevent this same verification from being reused in this page.
    otpVerified = false;
    verifiedUsername = "";
    verifiedEmail = "";
    generatedOTP = "";

    alert("Password successfully changed!");
    window.location.href = "login.html";
}
