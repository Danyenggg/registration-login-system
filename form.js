console.log("validateForm is running");

function validateForm() {
    var username = document.getElementById("username").value.trim();
    var email = document.getElementById("email").value.trim();
    var contact = document.getElementById("contact").value.trim();
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
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
    
    if (!address) {
    alert("Address is required.");
    return false;
        
    }
    
    if (!password) {
        alert("Password is required.");
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


var password = document.getElementById("password");
var confirmPassword = document.getElementById("confirmPassword");
var passwordError = document.getElementById("passwordError");

confirmPassword.addEventListener("input", function () {
    if (confirmPassword.value !== password.value) {
        passwordError.textContent = "Passwords do not match!";
        passwordError.style.color = "red";
    } else {
        passwordError.textContent = "Passwords match!";
        passwordError.style.color = "green";
    }
});