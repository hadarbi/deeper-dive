const BASE_URL = "http://localhost:3000/api";

/**
 * Constructs the full API URL from a path
 */
export function buildApiUrl(path: string): string {
    return `${BASE_URL}${path}`;
}

/**
 * Constructs URL for fetching all publishers with pagination
 */
export function getPublishersUrl(
    search?: string,
    isActive?: boolean,
    page?: number,
    limit?: number
): string {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (isActive !== undefined) params.append("isActive", String(isActive));
    if (page !== undefined) params.append("page", String(page));
    if (limit !== undefined) params.append("limit", String(limit));
    const queryString = params.toString();
    return `/publishers${queryString ? `?${queryString}` : ""}`;
}

/**
 * Constructs URL for fetching a specific publisher by publisherId
 */
export function getPublisherByIdUrl(publisherId: string): string {
    return `/publishers/${publisherId}`;
}

/**
 * Constructs URL for fetching audit logs for a specific publisher
 */
export function getPublisherAuditLogsUrl(
    publisherId: string,
    page?: number,
    limit?: number
): string {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", String(page));
    if (limit !== undefined) params.append("limit", String(limit));
    const queryString = params.toString();
    return `/publishers/${publisherId}/audit-logs${queryString ? `?${queryString}` : ""}`;
}
