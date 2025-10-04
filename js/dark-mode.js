document.addEventListener('DOMContentLoaded', function() {
  // Check for saved dark mode preference or default to light mode
  const darkModePreference = localStorage.getItem('darkMode');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial dark mode state
  if (darkModePreference === 'true' || (darkModePreference === null && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  }
  
  // Get dark mode toggle buttons
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const mobileDarkModeToggle = document.getElementById('mobile-dark-mode-toggle');
  
  // Function to toggle dark mode
  function toggleDarkMode() {
    const isDarkMode = document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', isDarkMode);
  }
  
  // Add event listeners to toggle buttons
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  }
  
  if (mobileDarkModeToggle) {
    mobileDarkModeToggle.addEventListener('click', toggleDarkMode);
  }
  
  // Listen for system color scheme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    // Only update if user hasn't explicitly set a preference
    if (localStorage.getItem('darkMode') === null) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
});