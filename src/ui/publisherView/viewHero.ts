import { Publisher } from "../../types/publisher.js";
import { createElement } from "../../utils/dom.js";
import { setState } from "../../state/store.js";
import { publisherService } from "../../services/publisherService.js";
import { showConfirmDialog } from "../modal.js";
import { openAuditLogPanel } from "../auditLogPanel/auditLogPanel.js";

export function renderViewHero(
    publisher: Publisher,
): HTMLElement {
    const hero = createElement("div", "publisher-hero");

    // Large avatar with gradient
    const avatar = createElement("div", "publisher-avatar-large", publisher.aliasName[0].toUpperCase());
    hero.append(avatar);

    // Title section
    const titleSection = renderTitleSection(publisher);
    hero.append(titleSection);

    // Quick action buttons
    const heroActions = renderHeroActions(publisher);
    hero.append(heroActions);

    return hero;
}

function renderTitleSection(publisher: Publisher): HTMLElement {
    const titleSection = createElement("div", "publisher-title-section");

    // Status badge with pulse animation
    const statusBadge = createElement("div", `status-badge ${publisher.isActive ? "status-active" : "status-inactive"}`);
    const statusDot = createElement("span", "status-dot");
    const statusText = createElement("span", "status-text", publisher.isActive ? "Active" : "Inactive");
    statusBadge.append(statusDot, statusText);

    const titleRow = createElement("div", "title-row");
    titleRow.append(
        createElement("h1", "publisher-name", publisher.aliasName),
        statusBadge
    );

    const subtitleRow = createElement("div", "subtitle-row");
    subtitleRow.append(
        createElement("span", "filename-badge", `ID: ${publisher.publisherId}`),
        createElement("span", "filename-badge", publisher.filename || "")
    );

    titleSection.append(titleRow, subtitleRow);
    return titleSection;
}

function renderHeroActions(publisher: Publisher): HTMLElement {
    const heroActions = createElement("div", "hero-actions");

    const auditBtn = createElement("button", "btn-secondary", "📜 Audit Log") as HTMLButtonElement;
    auditBtn.onclick = () => {
        openAuditLogPanel(publisher.publisherId);
    };

    const editBtn = createElement("button", "btn-primary", "✏️ Edit") as HTMLButtonElement;
    editBtn.onclick = () => {
        setState({ isInCreateOrEditMode: true });
    };

    const deleteBtn = createElement("button", "btn-secondary", "🗑️ Delete") as HTMLButtonElement;
    deleteBtn.onclick = async () => {
        try {
            const confirmed = await showConfirmDialog(
                "Delete Publisher",
                `Are you sure you want to delete "${publisher.aliasName}"? This action cannot be undone.`
            );
            if (!confirmed) return;

            // Delete the publisher
            await publisherService.delete(publisher.publisherId);

            // Refresh the page to show the updated list
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete publisher:", error);
            alert("Failed to delete publisher. Please try again.");
        }
    };

    const downloadBtn = createElement("button", "btn-secondary", "💾 Download") as HTMLButtonElement;
    downloadBtn.onclick = () => {
        try {
            const payload = JSON.stringify(publisher, null, 2);
            const blob = new Blob([payload], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = publisher.filename || `${publisher.publisherId}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download JSON failed", err);
        }
    };

    heroActions.append(auditBtn, editBtn, deleteBtn, downloadBtn);
    return heroActions;
}
