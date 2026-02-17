import { Publisher } from "../../types/publisher.js";
import { createElement } from "../../utils/dom.js";

export function renderStatsGrid(publisher: Publisher): HTMLElement {
    const statsGrid = createElement("div", "stats-grid");

    const pageCountCard = createElement("div", "stat-card");
    pageCountCard.innerHTML = `
        <div class="stat-icon">📑</div>
        <div class="stat-content">
            <div class="stat-value">${(publisher.pages ?? []).length}</div>
            <div class="stat-label">Pages Configured</div>
        </div>
    `;

    const tagCountCard = createElement("div", "stat-card");
    tagCountCard.innerHTML = `
        <div class="stat-icon">🏷️</div>
        <div class="stat-content">
            <div class="stat-value">${(publisher.tags ?? []).length}</div>
            <div class="stat-label">Tags</div>
        </div>
    `;

    const domainCountCard = createElement("div", "stat-card");
    domainCountCard.innerHTML = `
        <div class="stat-icon">🌐</div>
        <div class="stat-content">
            <div class="stat-value">${(publisher.allowedDomains ?? []).length}</div>
            <div class="stat-label">Allowed Domains</div>
        </div>
    `;

    statsGrid.append(pageCountCard, tagCountCard, domainCountCard);
    return statsGrid;
}
