import { Publisher } from "../../types/publisher.js";
import { createElement } from "../../utils/dom.js";
import { createViewSection } from "./common.js";

export function renderTagsSection(publisher: Publisher): HTMLElement {
    const tags = publisher.tags ?? [];

    if (tags.length === 0) {
        return createViewSection("🏷️", "Tags", null, "No tags available");
    }

    const tagsPillContainer = createElement("div", "tags-pill-container");
    tags.forEach((tag: string, index: number) => {
        const pill = createElement("span", "tag-pill", tag);
        const hue = (index * 137.5) % 360;
        pill.style.setProperty("--tag-hue", hue.toString());
        tagsPillContainer.append(pill);
    });

    return createViewSection("🏷️", "Tags", tagsPillContainer, "No tags available");
}

export function renderDomainsSection(publisher: Publisher): HTMLElement {
    const domains = publisher.allowedDomains ?? [];

    if (domains.length === 0) {
        return createViewSection("🌐", "Allowed Domains", null, "No domains available");
    }

    const domainsContainer = createElement("div", "domains-container");
    domains.forEach((domain: string) => {
        const chip = createElement("div", "domain-chip");
        chip.innerHTML = `<span class="domain-icon">🔗</span><span class="domain-text">${domain}</span>`;
        domainsContainer.append(chip);
    });

    return createViewSection("🌐", "Allowed Domains", domainsContainer, "No domains available");
}

export function renderNotesSection(publisher: Publisher): HTMLElement {
    if (!publisher.notes || publisher.notes.trim() === "") {
        return createViewSection("📝", "Notes", null, "No notes available");
    }

    const notesCard = createElement("div", "notes-card");
    const notesText = createElement("p", "notes-text", String(publisher.notes));
    notesCard.append(notesText);

    return createViewSection("📝", "Notes", notesCard, "No notes available");
}

export function renderCustomCssSection(publisher: Publisher): HTMLElement {
    if (!publisher.customCss || publisher.customCss.trim() === "") {
        return createViewSection("🎨", "Custom CSS", null, "No custom CSS available");
    }

    const cssCard = createElement("div", "notes-card");
    const cssCode = createElement("pre", "css-code", String(publisher.customCss));
    cssCode.style.cssText = "background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 14px;";
    cssCard.append(cssCode);

    return createViewSection("🎨", "Custom CSS", cssCard, "No custom CSS available");
}
