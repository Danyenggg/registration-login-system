
// Get the navigation elements
var menuToggle = document.getElementById("menuToggle");
var navLinks = document.getElementById("navLinks");

// Toggle the mobile navigation menu
menuToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the mobile menu after clicking a navigation link
var navigationItems = navLinks.querySelectorAll("a");

navigationItems.forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
    });
});

// Automatically display the current year in the footer
document.getElementById("currentYear").textContent =
    new Date().getFullYear();


