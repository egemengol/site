(function () {
  "use strict";

  let isDark = window.currentThemeIsDark || false;

  // Update UI elements that depend on theme
  function updateThemeUI() {
    const themeButton = document.querySelector(".theme-toggle");
    if (themeButton) {
      const themeIcon = document.getElementById("theme-icon");
      if (themeIcon) {
        themeIcon.src = isDark ? '/light_mode.svg' : '/dark_mode.svg';
        themeIcon.alt = isDark ? 'light' : 'dark';
      }

      themeButton.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );
      themeButton.setAttribute(
        "title",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );
    }
  }

  // Toggle theme function
  function toggleTheme() {
    isDark = !isDark;

    try {
      localStorage.setItem("isDark", isDark);
    } catch (e) {
      console.warn("Could not save theme preference:", e);
    }

    // Update DOM
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );

    // Update global state
    window.currentThemeIsDark = isDark;

    // Update UI elements
    updateThemeUI();

    // Dispatch custom event for other components
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { isDark: isDark, theme: isDark ? "dark" : "light" },
      }),
    );

    console.log("isDark", isDark);
  }

  // Set up event listeners when DOM is ready
  function setupEventListeners() {
    const themeButton = document.querySelector(".theme-toggle");
    if (themeButton) {
      themeButton.addEventListener("click", toggleTheme);
    }
  }

  // Initialize event listeners
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupEventListeners);
  } else {
    setupEventListeners();
  }

  // Listen for cross-tab theme changes
  window.addEventListener("storage", function (e) {
    if (e.key === "isDark" && e.newValue !== null) {
      const newIsDark = e.newValue === "true";
      if (newIsDark !== isDark) {
        isDark = newIsDark;
        window.currentThemeIsDark = isDark;
        document.documentElement.setAttribute(
          "data-theme",
          isDark ? "dark" : "light",
        );
        updateThemeUI();

        // Dispatch event for consistency
        window.dispatchEvent(
          new CustomEvent("themeChanged", {
            detail: { isDark: isDark, theme: isDark ? "dark" : "light" },
          }),
        );
      }
    }
  });

  // Utility functions for external use
  window.toggleTheme = toggleTheme;
  window.getCurrentTheme = function () {
    return isDark ? "dark" : "light";
  };
  window.isDarkMode = function () {
    return isDark;
  };

  // Prevent flash of unstyled content during transitions
  document.documentElement.style.setProperty("--transition-duration", "0s");

  // Re-enable transitions after a short delay
  setTimeout(() => {
    document.documentElement.style.removeProperty("--transition-duration");
  }, 100);
})();
