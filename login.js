 alert("Login JS is running");
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let user = document.getElementById("username").value.trim();
  let pass = document.getElementById("password").value.trim();

  let savedUser = localStorage.getItem("username");
  let savedPass = localStorage.getItem("password");

  
  if (savedUser === null || savedPass === null) {
    alert("No account found. Please register first.");
    return;
  }

  
  if (user === savedUser && pass === savedPass) {
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    alert("Incorrect username or password!");
  }
});