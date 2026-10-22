
 // Public key para sa EmailJS
emailjs.init({
    publicKey: "x26uA0Cqaligbqqil"
});

var verifiedUsername = "";
var verifiedEmail = "";

var newPasswordInput = document.getElementById("newPassword");
var confirmPasswordInput = document.getElementById("confirmPassword");
var confirmGroup = document.getElementById("forgotConfirmGroup");

var passwordRequirements = {
    length: document.getElementById("forgot-length"),
    upper: document.getElementById("forgot-upper"),
    lower: document.getElementById("forgot-lower"),
    number: document.getElementById("forgot-number"),
    special: document.getElementById("forgot-special")
};

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
            item.classList.add(
                result[key] ? "valid" : "invalid"
            );
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
    var account = document.getElementById("account").value.trim();
    var savedUsername = localStorage.getItem("username");
    var savedEmail = localStorage.getItem("email");
    var message = document.getElementById("message");
    var resetSection = document.getElementById("resetPassword");
    var otpSection = document.getElementById("otpSection");
    var continueButton = document.getElementById("continueButton");

    resetSection.style.display = "none";
    otpSection.style.display = "none";

    if (!account) {
        message.textContent = "Please enter your username or email.";
        message.style.color = "red";
        return;
    }

    var accountMatches =
        savedUsername &&
        account.toLowerCase() === savedUsername.toLowerCase();

    var emailMatches =
        savedEmail &&
        account.toLowerCase() === savedEmail.toLowerCase();

    if (!accountMatches && !emailMatches) {
        message.textContent = "Account not found.";
        message.style.color = "red";
        return;
    }

    if (!savedEmail) {
        message.textContent =
            "No registered email found. Please register your account again.";
        message.style.color = "red";
        return;
    }

    verifiedUsername = savedUsername;
    verifiedEmail = savedEmail;

    continueButton.disabled = true;
    message.textContent = "Sending password reset notification...";
    message.style.color = "black";

    try {
        await emailjs.send(
            "service_ip63ui5",
            "template_bqh5bjo",
            {
                username: verifiedUsername,
                email: verifiedEmail
            }
        );

        message.textContent =
            "Notification sent! Check your registered email. You can now set a new password in this prototype.";
        message.style.color = "green";

        resetSection.style.display = "block";

        newPasswordInput.value = "";
        confirmPasswordInput.value = "";
        updatePasswordRequirements();

    } catch (error) {
        console.error("EmailJS error:", error);

        message.textContent =
            "Email error: " +
            (error.text || error.message || JSON.stringify(error));

        message.style.color = "red";
    } finally {
        continueButton.disabled = false;
    }
}

function changePassword() {
    var newPassword = newPasswordInput.value;
    var confirmPassword = confirmPasswordInput.value;
    var message = document.getElementById("message");

    if (!verifiedUsername || !verifiedEmail) {
        message.textContent = "Please verify your account first.";
        message.style.color = "red";
        return;
    }

    if (!newPassword) {
        message.textContent = "Please create a new password.";
        message.style.color = "red";
        return;
    }

    if (!isStrongPassword(newPassword)) {
        message.textContent =
            "Password must have at least 8 characters, uppercase and lowercase letters, a number, and a special character.";
        message.style.color = "red";
        return;
    }

    if (!confirmPassword) {
        message.textContent = "Please re-enter your password.";
        message.style.color = "red";
        return;
    }

    if (newPassword !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        message.style.color = "red";
        return;
    }

    localStorage.setItem("password", newPassword);

    alert("Password successfully changed!");

    window.location.href = "login.html";
}
