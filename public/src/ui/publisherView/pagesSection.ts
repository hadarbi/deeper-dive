import { Publisher, Page } from "../../types/publisher.js";
import { createElement } from "../../utils/dom.js";
import { PAGE_TYPE_ICONS, POSITION_COLORS } from "../../constants/publisher.js";

export function renderPagesSection(publisher: Publisher): HTMLElement {
    if ((publisher.pages ?? []).length === 0) {
        return renderEmptyPagesState();
    }

    const pagesSection = createElement("div", "content-section");
    pagesSection.append(createElement("h2", "section-heading", "📄 Configured Pages"));

    const pagesGrid = createElement("div", "pages-grid");
    (publisher.pages ?? []).forEach((pg: Page) => {
        const pageCard = createPageCard(pg);
        pagesGrid.append(pageCard);
    });

    pagesSection.append(pagesGrid);
    return pagesSection;
}

function createPageCard(page: Page): HTMLElement {
    const pageCard = createElement("div", "page-card");

    const pageIcon = createElement("div", "page-icon", PAGE_TYPE_ICONS[page.pageType] || "📄");

    const pageContent = createElement("div", "page-content");
    pageContent.append(
        createElement("div", "page-type", page.pageType.toUpperCase()),
        createElement("div", "page-selector", page.selector)
    );

    const positionBadge = createElement("div", "position-badge");
    positionBadge.textContent = page.position;
    positionBadge.style.setProperty("--badge-color", POSITION_COLORS[page.position] || "#64748b");

    pageCard.append(pageIcon, pageContent, positionBadge);
    return pageCard;
}

function renderEmptyPagesState(): HTMLElement {
    const emptyState = createElement("div", "empty-state");
    emptyState.innerHTML = `
        <div class="empty-icon">📭</div>
        <div class="empty-title">No Pages Configured</div>
        <div class="empty-description">Add pages to start tracking configurations</div>
    `;
    return emptyState;
}
