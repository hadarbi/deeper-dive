import { getState, setState, Theme } from "../state/store.js";

const THEME_STORAGE_KEY = "publisher-app-theme";

/**
 * Loads the saved theme from localStorage
 */
function loadSavedTheme(): Theme {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
        return stored;
    }
    return "light";
}

/**
 * Applies the theme to the document
 */
function applyTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
}

/**
 * Sets the theme preference and applies it
 */
export function setTheme(theme: Theme): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    setState({ theme });
    applyTheme(theme);
}

/**
 * Toggles between light and dark theme
 */
export function toggleTheme(): void {
    const { theme } = getState();
    setTheme(theme === "light" ? "dark" : "light");
}

/**
 * Initializes the theme system
 * - Loads theme from localStorage
 * - Applies the initial theme
 */
export function initializeTheme(): void {
    const savedTheme = loadSavedTheme();
    setState({ theme: savedTheme });
    applyTheme(savedTheme);
}
