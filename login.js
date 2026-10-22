
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const savedUsername = localStorage.getItem("username");
  const savedPassword = localStorage.getItem("password");

  if (savedUsername === null || savedPassword === null) {
    alert("No account found. Please register first.");
    return;
  }

  if (username === savedUsername && password === savedPassword) {
    sessionStorage.setItem("studyspace_user", username);

    alert("Login successful!");

    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    const allowedPages = [
      "study-dashboard.html",
      "spaces.html",
      "reservations.html",
      "admin.html"
    ];

    if (next && allowedPages.includes(next)) {
      window.location.href = next;
    } else {
      window.location.href = "study-dashboard.html";
    }
  } else {
    alert("Incorrect username or password!");
  }
});
