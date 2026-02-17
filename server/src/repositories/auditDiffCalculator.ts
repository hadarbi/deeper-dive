import { Publisher } from "../types/publisher.js";
import { CreateAuditLogInput } from "../types/auditLog.js";

export function generateAuditLogs(
    publisherId: string,
    existing: Publisher,
    data: Partial<Publisher>,
    changedBy: string
): CreateAuditLogInput[] {
    const auditLogs: CreateAuditLogInput[] = [];

    // Track simple field changes
    auditLogs.push(...trackSimpleFieldChanges(publisherId, existing, data, changedBy));

    // Track array fields
    auditLogs.push(...trackArrayFieldChanges(publisherId, existing, data, changedBy));

    // Track pages changes
    auditLogs.push(...trackPagesChanges(publisherId, existing, data, changedBy));

    return auditLogs;
}

function trackSimpleFieldChanges(
    publisherId: string,
    existing: Publisher,
    data: Partial<Publisher>,
    changedBy: string
): CreateAuditLogInput[] {
    const auditLogs: CreateAuditLogInput[] = [];

    const fieldsToTrack: { key: keyof Publisher; label: string }[] = [
        { key: "aliasName", label: "Alias Name" },
        { key: "isActive", label: "Status" },
        { key: "publisherDashboard", label: "Publisher Dashboard" },
        { key: "monitorDashboard", label: "Monitor Dashboard" },
        { key: "qaStatusDashboard", label: "QA Dashboard" },
        { key: "customCss", label: "Custom CSS" },
        { key: "notes", label: "Notes" },
    ];

    for (const { key, label } of fieldsToTrack) {
        if (data[key] !== undefined) {
            const oldVal = existing[key];
            const newVal = data[key];
            const oldStr = oldVal === undefined || oldVal === null ? "" : String(oldVal);
            const newStr = newVal === undefined || newVal === null ? "" : String(newVal);

            if (oldStr !== newStr) {
                auditLogs.push({
                    publisherId,
                    action: "UPDATE",
                    fieldName: label,
                    oldValue: oldStr || "(empty)",
                    newValue: newStr || "(empty)",
                    changedBy,
                });
            }
        }
    }

    return auditLogs;
}

function trackArrayFieldChanges(
    publisherId: string,
    existing: Publisher,
    data: Partial<Publisher>,
    changedBy: string
): CreateAuditLogInput[] {
    const auditLogs: CreateAuditLogInput[] = [];

    const arrayFields: { key: "tags" | "allowedDomains"; label: string }[] = [
        { key: "tags", label: "Tags" },
        { key: "allowedDomains", label: "Allowed Domains" },
    ];

    for (const { key, label } of arrayFields) {
        if (data[key] !== undefined) {
            const oldArr = existing[key] || [];
            const newArr = data[key] || [];
            if (JSON.stringify(oldArr) !== JSON.stringify(newArr)) {
                auditLogs.push({
                    publisherId,
                    action: "UPDATE",
                    fieldName: label,
                    oldValue: oldArr.length > 0 ? oldArr.join(", ") : "(none)",
                    newValue: newArr.length > 0 ? newArr.join(", ") : "(none)",
                    changedBy,
                });
            }
        }
    }

    return auditLogs;
}

function trackPagesChanges(
    publisherId: string,
    existing: Publisher,
    data: Partial<Publisher>,
    changedBy: string
): CreateAuditLogInput[] {
    const auditLogs: CreateAuditLogInput[] = [];

    if (data.pages !== undefined) {
        const oldPages = JSON.stringify(existing.pages);
        const newPages = JSON.stringify(data.pages);
        if (oldPages !== newPages) {
            auditLogs.push({
                publisherId,
                action: "UPDATE",
                fieldName: "Pages",
                oldValue: `${existing.pages.length} page(s)`,
                newValue: `${data.pages.length} page(s)`,
                changedBy,
            });
        }
    }

    return auditLogs;
}
