
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");

  // Theme cycle order: light → dark → sunny → light
  const THEMES = ['light', 'dark', 'sunny'];

  // SVG icons — icon shown indicates where the NEXT click will take you
  const moonIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>`;

  // Warm sun with rays — shown in dark mode (next: sunny)
  const sunRaysIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>`;

  // Leaf icon — shown in sunny mode (next: light)
  const leafIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"></path>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
  </svg>`;

  // Update button icon and label to reflect the CURRENT theme
  function updateIcon(theme) {
    if (theme === 'dark') {
      toggleBtn.innerHTML = sunRaysIcon;
      toggleBtn.setAttribute('aria-label', 'Switch to sunny mode');
    } else if (theme === 'sunny') {
      toggleBtn.innerHTML = leafIcon;
      toggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      toggleBtn.innerHTML = moonIcon;
      toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // Handle theme toggle — cycle through THEMES array
  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const currentIndex = THEMES.indexOf(currentTheme);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    updateIcon(nextTheme);
  });

  // Initialize theme from localStorage or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateIcon(savedTheme);

  // Add smooth transition class after initial load to prevent flash
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});
