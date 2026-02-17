import { subscribe } from "./state/store.js";
import { subscribeToRoute, useRoute } from "./state/router.js";
import { fetchPublishers } from "./handlers/handleFetchPublishers.js";
import { ROUTE_MAP } from "./state/routePages.js";
import { clearDOM } from "./utils/dom.js";
import { initializeTheme } from "./services/themeService.js";
import { createThemeToggle } from "./ui/themeToggle.js";

const root = document.getElementById("app")!;
function render() {
    const { route } = useRoute();
    clearDOM(root);
    ROUTE_MAP[route](root); // Render the page based on the current route
}

// Initialize theme before first render
initializeTheme();

// Add global theme toggle (fixed position)
createThemeToggle();

subscribe(render);
subscribeToRoute(render);
fetchPublishers();
render();
