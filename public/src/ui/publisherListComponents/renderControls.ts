import { navigate, RouteKey } from "../../state/router.js";
import { setState } from "../../state/store.js";
import { createElement } from "../../utils/dom.js";
import { renderFilterChips } from "./renderFilterChips.js";

export function renderControls(publishersCount: number, loading: boolean, error: string | null): HTMLElement {
    const controls = createElement("div", "controls");

    // Filter chips
    const filterChips = renderFilterChips();
    controls.append(filterChips);

    // Results count
    if (!loading && !error) {
        const resultsCount = createElement("span", "results-count",
            `${publishersCount} publisher${publishersCount !== 1 ? "s" : ""}`);
        controls.append(resultsCount);
    }

    // Add Publisher button
    const addBtn = createElement("button", "primary", "Add Publisher");
    addBtn.onclick = () => {
        setState({ isInCreateOrEditMode: true });
        navigate(RouteKey.PUBLISHER_PAGE);
    };
    controls.append(addBtn);

    return controls;
}
