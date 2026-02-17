import { Publisher } from "../../types/publisher.js";
import { createElement } from "../../utils/dom.js";
import { renderViewHero } from "./viewHero.js";
import { renderStatsGrid } from "./statsSection.js";
import { renderPagesSection } from "./pagesSection.js";
import { renderDashboardsSection } from "./dashboardsSection.js";
import {
    renderTagsSection,
    renderDomainsSection,
    renderNotesSection,
    renderCustomCssSection
} from "./contentSections.js";

export function renderPublisherView(
    publisher: Publisher | null,
) {
    const container = createElement("div", "publisher-view-page");

    if (!publisher) {
        container.append(createElement("p", "", "Publisher not found"));
        return container;
    }

    // Hero Section
    container.append(renderViewHero(publisher));

    // Content wrapper
    const content = createElement("div", "publisher-content");
    [
        renderStatsGrid,
        renderPagesSection,
        renderDashboardsSection,
        renderTagsSection,
        renderDomainsSection,
        renderNotesSection,
        renderCustomCssSection
    ].forEach(renderer => {
        content.append(renderer(publisher));
    });

    container.append(content);
    return container;
}
