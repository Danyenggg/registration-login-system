// Public key para sa EmailJs
emailjs.init({
    publicKey: "x26uA0Cqaligbqqil"
});

var verifiedUsername = "";
var verifiedEmail = "";

async function verifyAccount() {
    var account = document.getElementById("account").value.trim();
    var savedUsername = localStorage.getItem("username");
    var savedEmail = localStorage.getItem("email");
    var message = document.getElementById("message");
    var resetSection = document.getElementById("resetPassword");
    var continueButton = document.getElementById("continueButton");

    resetSection.style.display = "none";

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
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var message = document.getElementById("message");

    if (!verifiedUsername || !verifiedEmail) {
        message.textContent = "Please verify your account first.";
        message.style.color = "red";
        return;
    }

    if (!newPassword || !confirmPassword) {
        message.textContent = "Please fill in both password fields.";
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