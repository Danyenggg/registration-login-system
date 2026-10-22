console.log("validateForm is running");

var passwordInput = document.getElementById("password");
var confirmPasswordInput = document.getElementById("confirmPassword");
var confirmPasswordGroup = document.getElementById("confirmPasswordGroup");
var passwordError = document.getElementById("passwordError");

var requirements = {
    length: document.getElementById("reg-length"),
    upper: document.getElementById("reg-upper"),
    lower: document.getElementById("reg-lower"),
    number: document.getElementById("reg-number"),
    special: document.getElementById("reg-special")
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
    var password = passwordInput.value;
    var result = checkPassword(password);

    Object.keys(requirements).forEach(function (key) {
        requirements[key].classList.remove("valid", "invalid");

        if (password.length > 0) {
            requirements[key].classList.add(
                result[key] ? "valid" : "invalid"
            );
        }
    });

    if (password.length > 0) {
        confirmPasswordGroup.style.display = "block";
        confirmPasswordInput.disabled = false;
        confirmPasswordInput.required = true;
    } else {
        confirmPasswordGroup.style.display = "none";
        confirmPasswordInput.disabled = true;
        confirmPasswordInput.required = false;
        confirmPasswordInput.value = "";
        passwordError.textContent = "";
    }

    checkPasswordMatch();
}

function checkPasswordMatch() {
    if (!confirmPasswordInput.value) {
        passwordError.textContent = "";
        return;
    }

    if (confirmPasswordInput.value === passwordInput.value) {
        passwordError.textContent = "Passwords match!";
        passwordError.style.color = "green";
    } else {
        passwordError.textContent = "Passwords do not match!";
        passwordError.style.color = "red";
    }
}

passwordInput.addEventListener("input", updatePasswordRequirements);
confirmPasswordInput.addEventListener("input", checkPasswordMatch);

function validateForm() {
    var username = document.getElementById("username").value.trim();
    var email = document.getElementById("email").value.trim();
    var contact = document.getElementById("contact").value.trim();
    var password = passwordInput.value;
    var confirmPassword = confirmPasswordInput.value;
    var address = document.getElementById("address").value.trim();
    var birthdate = document.getElementById("birthdate").value;
    var genderEls = document.getElementsByName("gender");
    var course = document.getElementById("course").value;
    var year = document.getElementById("year").value;
    var section = document.getElementById("section").value;
    var terms = document.getElementById("terms").checked;

    if (!username) {
        alert("Username is required.");
        return false;
    }

    if (!email) {
        alert("Email is required.");
        return false;
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Invalid email.");
        return false;
    }

    if (!contact) {
        alert("Contact Number is required.");
        return false;
    }

    if (!/^[0-9]{11}$/.test(contact)) {
        alert("Contact Number must contain exactly 11 digits.");
        return false;
    }

    if (!address) {
        alert("Address is required.");
        return false;
    }

    if (!password) {
        alert("Password is required.");
        return false;
    }

    if (!isStrongPassword(password)) {
        alert(
            "Your password must contain at least 8 characters, " +
            "an uppercase letter, a lowercase letter, a number, " +
            "and a special character."
        );
        return false;
    }

    if (!confirmPassword) {
        alert("Please re-enter your password.");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    if (!birthdate) {
        alert("Birthdate required.");
        return false;
    }

    var genderSelected = false;

    for (var i = 0; i < genderEls.length; i++) {
        if (genderEls[i].checked) {
            genderSelected = true;
            break;
        }
    }

    if (!genderSelected) {
        alert("Select gender.");
        return false;
    }

    if (!course || !year || !section) {
        alert("Complete course/year/section.");
        return false;
    }

    if (!terms) {
        alert("Agree to terms.");
        return false;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    alert("Registration Successful!");

    window.location.href = "login.html";

    return false;
}

document.getElementById("registerform").addEventListener("reset", function () {
    setTimeout(function () {
        updatePasswordRequirements();
    }, 0);
});
