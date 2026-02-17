import { AuditLog } from "../../types/auditLog.js";
import { createElement } from "../../utils/dom.js";
import { publisherService } from "../../services/publisherService.js";

let currentPanel: HTMLElement | null = null;
let currentOverlay: HTMLElement | null = null;

/**
 * Opens the audit log side panel for a publisher
 */
export async function openAuditLogPanel(publisherId: string): Promise<void> {
    // Close any existing panel
    closeAuditLogPanel();

    // Create overlay
    currentOverlay = createElement("div", "audit-panel-overlay");
    document.body.appendChild(currentOverlay);

    // Create panel
    currentPanel = createElement("div", "audit-log-panel");
    currentPanel.innerHTML = `
        <div class="audit-panel-header">
            <h2 class="audit-panel-title">📜 Audit Log</h2>
            <button class="audit-panel-close" aria-label="Close panel">✕</button>
        </div>
        <div class="audit-panel-content">
            <div class="audit-loading">Loading audit logs...</div>
        </div>
    `;

    // Prevent clicks on panel from closing it
    currentPanel.onclick = (e) => e.stopPropagation();

    // Add close button handler
    const closeBtn = currentPanel.querySelector(".audit-panel-close") as HTMLButtonElement;
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeAuditLogPanel();
    };

    document.body.appendChild(currentPanel);

    // Trigger animation after a frame
    requestAnimationFrame(() => {
        currentOverlay?.classList.add("open");
        currentPanel?.classList.add("open");
    });

    // Add overlay click handler after a delay to prevent immediate close from button click
    setTimeout(() => {
        if (currentOverlay) {
            currentOverlay.onclick = closeAuditLogPanel;
        }
    }, 100);

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Fetch and render audit logs
    try {
        const response = await publisherService.getAuditLogs(publisherId, 1, 50);
        renderAuditLogs(response.data, response.pagination.totalItems);
    } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        renderAuditLogsError();
    }
}

/**
 * Closes the audit log side panel
 */
export function closeAuditLogPanel(): void {
    const panelToClose = currentPanel;
    const overlayToClose = currentOverlay;

    if (panelToClose) {
        panelToClose.classList.remove("open");
    }
    if (overlayToClose) {
        overlayToClose.classList.remove("open");
    }

    // Clear references immediately so new panel can be created
    currentPanel = null;
    currentOverlay = null;

    // Remove elements after animation
    setTimeout(() => {
        panelToClose?.remove();
        overlayToClose?.remove();
        document.body.style.overflow = "";
    }, 300);
}

/**
 * Renders the audit logs in the panel
 */
function renderAuditLogs(logs: AuditLog[], totalItems: number): void {
    const content = currentPanel?.querySelector(".audit-panel-content");
    if (!content) return;

    if (logs.length === 0) {
        content.innerHTML = `
            <div class="audit-empty">
                <span class="audit-empty-icon">📋</span>
                <p>No changes recorded yet</p>
            </div>
        `;
        return;
    }

    content.innerHTML = `
        <div class="audit-summary">
            <span>${totalItems} change${totalItems !== 1 ? "s" : ""} recorded</span>
        </div>
        <div class="audit-log-list"></div>
    `;

    const list = content.querySelector(".audit-log-list") as HTMLElement;
    logs.forEach(log => {
        list.appendChild(renderAuditLogEntry(log));
    });
}

function renderAuditLogEntry(log: AuditLog): HTMLElement {
    const entry = createElement("div", "audit-log-entry");

    const actionClass = `audit-action-${log.action.toLowerCase()}`;
    const actionIcon = getActionIcon(log.action);
    const formattedDate = formatDate(log.changedAt);

    entry.innerHTML = `
        <div class="audit-entry-header">
            <span class="audit-entry-date">${formattedDate}</span>
            <span class="audit-entry-action ${actionClass}">${actionIcon} ${log.action}</span>
        </div>
        <div class="audit-entry-user">by <strong>${log.changedBy}</strong></div>
        ${log.action === "CREATE"
            ? "<div class=\"audit-entry-message\">Publisher created</div>"
            : log.fieldName
                ? `<div class="audit-entry-field">${log.fieldName}</div>
                   <div class="audit-entry-change">
                       <span class="audit-old-value">${truncateValue(log.oldValue || "")}</span>
                       <span class="audit-arrow">→</span>
                       <span class="audit-new-value">${truncateValue(log.newValue || "")}</span>
                   </div>`
                : ""
        }
    `;

    return entry;
}

function renderAuditLogsError(): void {
    const content = currentPanel?.querySelector(".audit-panel-content");
    if (!content) return;

    content.innerHTML = `
        <div class="audit-error">
            <span class="audit-error-icon">⚠️</span>
            <p>Failed to load audit logs</p>
            <button class="audit-retry-btn">Retry</button>
        </div>
    `;
}

/**
 * Gets the icon for an action type
 */
function getActionIcon(action: AuditLog["action"]): string {
    switch (action) {
        case "CREATE": return "✨";
        case "UPDATE": return "🔄";
        case "DELETE": return "🗑️";
        default: return "📝";
    }
}

/**
 * Formats a date string for display
 */
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

/**
 * Truncates a value for display
 */
function truncateValue(value: string, maxLength: number = 50): string {
    if (value.length <= maxLength) return escapeHtml(value);
    return escapeHtml(value.substring(0, maxLength)) + "…";
}

/**
 * Escapes HTML entities
 */
function escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
