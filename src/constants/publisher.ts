/**
 * Shared constants for publisher configuration
 */

export const PAGE_TYPES = ["article", "homepage", "category", "search", "product"] as const;
export const POSITIONS = ["top", "middle", "bottom", "sidebar"] as const;

export type PageType = typeof PAGE_TYPES[number];
export type Position = typeof POSITIONS[number];

export const PAGE_TYPE_ICONS: Record<string, string> = {
    article: "📄",
    homepage: "🏠",
    category: "📂",
    search: "🔍",
    product: "🛍️"
};

export const POSITION_COLORS: Record<string, string> = {
    top: "#3B82F6",
    middle: "#8B5CF6",
    bottom: "#06b6d4",
    sidebar: "#10B981"
};

export const KNOWN_PUBLISHER_FIELDS = new Set([
    "publisherId", "aliasName", "isActive", "pages", "publisherDashboard",
    "monitorDashboard", "qaStatusDashboard", "customCss", "tags",
    "allowedDomains", "notes", "filename"
]);
