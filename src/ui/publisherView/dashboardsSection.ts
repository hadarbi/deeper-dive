import { Publisher } from "../../types/publisher.js";
import { createElement } from "../../utils/dom.js";

export function renderDashboardsSection(publisher: Publisher): HTMLElement {
    const dashboardsSection = createElement("div", "content-section");
    dashboardsSection.append(createElement("h2", "section-heading", "📊 Dashboards & Monitoring"));

    const dashboardsGrid = createElement("div", "dashboards-grid");

    if (publisher.publisherDashboard) {
        const card = createDashboardCard("Publisher Dashboard", publisher.publisherDashboard, "📈", "#3B82F6");
        dashboardsGrid.append(card);
    }

    if (publisher.monitorDashboard) {
        const card = createDashboardCard("Monitor Dashboard", publisher.monitorDashboard, "📡", "#8B5CF6");
        dashboardsGrid.append(card);
    }

    if (publisher.qaStatusDashboard) {
        const card = createDashboardCard("QA Status", publisher.qaStatusDashboard, "✅", "#10B981");
        dashboardsGrid.append(card);
    }

    if (dashboardsGrid.children.length === 0) {
        const emptyMessage = createElement("p", "empty-message", "No dashboards available");
        dashboardsSection.append(emptyMessage);
    } else {
        dashboardsSection.append(dashboardsGrid);
    }

    return dashboardsSection;
}

function createDashboardCard(title: string, url: string, icon: string, color: string): HTMLElement {
    const card = createElement("div", "dashboard-card");
    card.style.setProperty("--dash-color", color);

    const link = createElement("a", "dashboard-link", "") as HTMLAnchorElement;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    link.innerHTML = `
        <div class="dashboard-icon">${icon}</div>
        <div class="dashboard-info">
            <div class="dashboard-title">${title}</div>
            <div class="dashboard-url">${url}</div>
        </div>
        <div class="dashboard-arrow">↗</div>
    `;

    card.append(link);
    return card;
}
