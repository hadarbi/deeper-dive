import { Publisher } from "../../../types/publisher.js";
import { createElement } from "../../../utils/dom.js";

export function renderCardAvatar(aliasName: string): HTMLElement {
    return createElement(
        "div",
        "publisher-avatar",
        aliasName[0].toUpperCase()
    );
}

export function renderCardInfo(publisher: Publisher): HTMLElement {
    const info = createElement("div", "publisher-info");
    info.append(createElement("h3", "publisher-title", publisher.aliasName));
    info.append(createElement("p", "publisher-file", publisher.filename));

    // Add metadata section
    const meta = createElement("div", "publisher-meta");

    // Status badge from actual data
    const statusClass = publisher.isActive ? "active" : "inactive";
    const statusText = publisher.isActive ? "● Active" : "● Inactive";
    const badge = createElement("span", `publisher-badge ${statusClass}`, statusText);

    // Last modified date (simulated - in real app, would come from data)
    const date = createElement("span", "publisher-date", "Updated 2 days ago");

    meta.append(badge, date);
    info.append(meta);

    return info;
}
