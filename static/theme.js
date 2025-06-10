// Theme initialization and utility functions
(function() {
    'use strict';
    
    // Initialize theme on page load
    function initializeTheme() {
        // Get saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let initialTheme;
        if (savedTheme) {
            initialTheme = savedTheme;
        } else {
            initialTheme = systemPrefersDark ? 'dark' : 'light';
        }
        
        // Apply theme immediately to prevent flash
        document.documentElement.setAttribute('data-theme', initialTheme);
        
        // Update Alpine.js data if available
        if (window.Alpine && window.Alpine.store) {
            window.Alpine.store('theme', {
                current: initialTheme,
                isDark: initialTheme === 'dark'
            });
        }
    }
    
    // Listen for system theme changes
    function watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Only update if user hasn't manually set a preference
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                
                // Dispatch custom event for other components
                window.dispatchEvent(new CustomEvent('themeChanged', {
                    detail: { theme: newTheme }
                }));
            }
        });
    }
    
    // Utility function to toggle theme programmatically
    window.toggleTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: newTheme }
        }));
        
        return newTheme;
    };
    
    // Utility function to get current theme
    window.getCurrentTheme = function() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    };
    
    // Initialize immediately
    initializeTheme();
    
    // Initialize system theme watching when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', watchSystemTheme);
    } else {
        watchSystemTheme();
    }
    
    // Prevent flash of unstyled content
    document.documentElement.style.setProperty('--transition-duration', '0s');
    
    // Re-enable transitions after a short delay
    setTimeout(() => {
        document.documentElement.style.removeProperty('--transition-duration');
    }, 100);
})();