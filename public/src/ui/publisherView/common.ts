import { createElement } from "../../utils/dom.js";

export function createViewSection(
    icon: string,
    title: string,
    content: HTMLElement | null,
    emptyMessage: string
): HTMLElement {
    const section = createElement("div", "content-section");
    section.append(createElement("h2", "section-heading", `${icon} ${title}`));

    if (!content) {
        const emptyMsg = createElement("p", "empty-message", emptyMessage);
        section.append(emptyMsg);
    } else {
        section.append(content);
    }

    return section;
}


export function createEmptyMessage(message: string): HTMLElement {
    return createElement("p", "empty-message", message);
}
