import { createElement } from "../../utils/dom.js";
import { renderSearchContainer } from "./renderSearchContainer.js";
import { renderControls } from "./renderControls.js";

export function renderPublishersListHeader(
    search: string,
    publishersCount: number,
    loading: boolean,
    error: string | null
) {
    const header = createElement("div", "page-header");

    // Title
    const title = createElement("h1", "", "Publishers");
    header.append(title);

    // Search container
    const searchContainer = renderSearchContainer(search);
    header.append(searchContainer);

    // Controls row
    const controls = renderControls(publishersCount, loading, error);
    header.append(controls);

    return { header, searchInput: searchContainer.querySelector(".search-input") as HTMLInputElement };
}
