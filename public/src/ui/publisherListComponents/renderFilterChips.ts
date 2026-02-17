import { createElement } from "../../utils/dom.js";
import { setState, getState } from "../../state/store.js";
import { fetchPublishers } from "../../handlers/handleFetchPublishers.js";

type FilterStatus = "all" | "active" | "inactive";

interface ChipConfig {
    status: FilterStatus;
    label: string;
}

const CHIP_CONFIGS: ChipConfig[] = [
    { status: "all", label: "All" },
    { status: "active", label: "Active" },
    { status: "inactive", label: "Inactive" }
];

function createFilterChip(config: ChipConfig, currentStatus: FilterStatus): HTMLElement {
    const isActive = config.status === currentStatus;
    const chip = createElement("button", `filter-chip${isActive ? " active" : ""}`, config.label);

    chip.onclick = async () => {
        document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        setState({ filterStatus: config.status });
        const { search } = getState();
        await fetchPublishers(search || undefined, 1); // Reset to page 1 on filter change
    };

    return chip;
}

export function renderFilterChips(): HTMLElement {
    const filterChips = createElement("div", "filter-chips");
    const { filterStatus } = getState();

    const chips = CHIP_CONFIGS.map(config => createFilterChip(config, filterStatus));
    filterChips.append(...chips);

    return filterChips;
}
