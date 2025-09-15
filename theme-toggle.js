
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  
  // Function to update the icon based on theme
  function updateIcon(theme) {
    if (theme === "dark") {
      toggleBtn.textContent = "☀️"; // Sun icon for dark mode
      toggleBtn.setAttribute("aria-label", "Switch to light mode");
    } else {
      toggleBtn.textContent = "🌙"; // Moon icon for light mode
      toggleBtn.setAttribute("aria-label", "Switch to dark mode");
    }
  }
  
  // Handle theme toggle
  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    updateIcon(nextTheme);
  });

  // Initialize theme from localStorage or default to light
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateIcon(savedTheme);
  
  // Add smooth transition class after initial load to prevent flash
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});
