import { createElement } from "../utils/dom.js";
import { getState } from "../state/store.js";
import { toggleTheme } from "../services/themeService.js";

/**
 * Gets the icon for the current theme
 */
function getThemeIcon(): string {
    const { theme } = getState();
    return theme === "light" ? "☀️" : "🌙";
}

/**
 * Gets the tooltip text for the current theme
 */
function getThemeTooltip(): string {
    const { theme } = getState();
    return theme === "light"
        ? "Theme: Light (click to switch to Dark)"
        : "Theme: Dark (click to switch to Light)";
}

/**
 * Creates the theme toggle button and appends it to the document body
 */
export function createThemeToggle(): void {
    const button = createElement("button", "theme-toggle theme-toggle-global") as HTMLButtonElement;
    button.type = "button";
    button.setAttribute("aria-label", "Toggle theme");

    updateToggleButton(button);

    button.addEventListener("click", () => {
        toggleTheme();
        updateToggleButton(button);
    });

    document.body.appendChild(button);
}

/**
 * Updates the toggle button's content and tooltip
 */
function updateToggleButton(button: HTMLButtonElement): void {
    button.textContent = getThemeIcon();
    button.title = getThemeTooltip();
    button.dataset.theme = getState().theme;
}
