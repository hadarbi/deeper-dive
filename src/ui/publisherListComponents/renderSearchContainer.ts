import { createElement } from "../../utils/dom.js";
import { setState } from "../../state/store.js";
import { fetchPublishers } from "../../handlers/handleFetchPublishers.js";


export function renderSearchContainer(search: string): HTMLElement {
    const searchContainer = createElement("div", "search-container");

    const searchInput = createElement("input") as HTMLInputElement;
    searchInput.type = "search";
    searchInput.placeholder = "Search publishers by name";
    searchInput.className = "search-input";
    searchInput.value = search;

    const searchButton = createElement("button", "btn btn-primary") as HTMLButtonElement;
    searchButton.textContent = "Search";
    searchButton.type = "button";

    searchContainer.append(searchInput, searchButton);

    // Search on button click
    searchButton.addEventListener("click", async () => {
        const q = (searchInput.value || "").trim();
        setState({ search: q });
        await fetchPublishers(q || undefined, 1); // Reset to page 1 on new search
    });

    // Also allow Enter key to trigger search
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            searchButton.click();
        }
    });

    return searchContainer;
}
