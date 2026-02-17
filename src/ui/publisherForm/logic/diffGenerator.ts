import { Publisher } from "../../../types/publisher.js";

interface ChangeItem {
    field: string;
    label: string;
    oldValue: string;
    newValue: string;
}

const FIELD_LABELS: Record<string, string> = {
    aliasName: "Alias Name",
    isActive: "Status",
    publisherDashboard: "Publisher Dashboard",
    monitorDashboard: "Monitor Dashboard",
    qaStatusDashboard: "QA Dashboard",
    customCss: "Custom CSS",
    tags: "Tags",
    allowedDomains: "Allowed Domains",
    notes: "Notes",
    pages: "Pages"
};

/**
 * Normalizes a value for comparison (handles undefined, null, empty strings)
 */
function normalize(value: unknown): string {
    if (value === undefined || value === null) return "";
    if (typeof value === "string") return value.trim();
    if (typeof value === "boolean") return value ? "Active" : "Inactive";
    if (Array.isArray(value)) return JSON.stringify(value);
    return String(value);
}

/**
 * Formats an array value for display
 */
function formatArrayForDisplay(arr: string[] | undefined): string {
    if (!arr || arr.length === 0) return "(none)";
    return arr.join(", ");
}

function truncate(str: string, maxLen: number = 30): string {
    if (str.length <= maxLen) return str;
    return str.substring(0, maxLen) + "…";
}

export function generateDiff(original: Publisher, updated: Publisher): ChangeItem[] {
    const changes: ChangeItem[] = [];

    // Simple string fields
    const stringFields: (keyof Publisher)[] = [
        "aliasName",
        "publisherDashboard",
        "monitorDashboard",
        "qaStatusDashboard",
        "customCss",
        "notes"
    ];

    for (const field of stringFields) {
        const oldVal = normalize(original[field]);
        const newVal = normalize(updated[field]);
        if (oldVal !== newVal) {
            changes.push({
                field,
                label: FIELD_LABELS[field] || field,
                oldValue: oldVal || "(empty)",
                newValue: newVal || "(empty)"
            });
        }
    }

    // Boolean field: isActive
    if (original.isActive !== updated.isActive) {
        changes.push({
            field: "isActive",
            label: FIELD_LABELS.isActive,
            oldValue: original.isActive ? "Active" : "Inactive",
            newValue: updated.isActive ? "Active" : "Inactive"
        });
    }

    // Array fields: tags, allowedDomains
    const arrayFields: (keyof Publisher)[] = ["tags", "allowedDomains"];
    for (const field of arrayFields) {
        const oldArr = (original[field] as string[] | undefined) || [];
        const newArr = (updated[field] as string[] | undefined) || [];
        if (JSON.stringify(oldArr) !== JSON.stringify(newArr)) {
            changes.push({
                field,
                label: FIELD_LABELS[field] || field,
                oldValue: formatArrayForDisplay(oldArr),
                newValue: formatArrayForDisplay(newArr)
            });
        }
    }

    // Pages comparison
    const oldPages = JSON.stringify(original.pages || []);
    const newPages = JSON.stringify(updated.pages || []);
    if (oldPages !== newPages) {
        const oldCount = original.pages?.length || 0;
        const newCount = updated.pages?.length || 0;
        changes.push({
            field: "pages",
            label: FIELD_LABELS.pages,
            oldValue: `${oldCount} page${oldCount !== 1 ? "s" : ""}`,
            newValue: `${newCount} page${newCount !== 1 ? "s" : ""}`
        });
    }

    return changes;
}

/**
 * Formats changes into display strings for the modal
 */
export function formatChangesForDisplay(changes: ChangeItem[]): string[] {
    return changes.map(change => {
        const oldDisplay = truncate(change.oldValue);
        const newDisplay = truncate(change.newValue);
        return `${change.label}: "${oldDisplay}" → "${newDisplay}"`;
    });
}
