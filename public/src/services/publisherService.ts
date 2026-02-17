import { Publisher, PaginatedResponse } from "../types/publisher.js";
import { AuditLog } from "../types/auditLog.js";
import { request } from "./apiClient.js";
import {
    getPublishersUrl,
    getPublisherByIdUrl,
    getPublisherAuditLogsUrl,
} from "./urlBuilder.js";

export const publisherService = {
    getAll(
        search?: string,
        isActive?: boolean,
        page?: number,
        limit?: number
    ): Promise<PaginatedResponse<Publisher>> {
        return request(getPublishersUrl(search, isActive, page, limit));
    },

    getById(publisherId: string): Promise<Publisher> {
        return request(getPublisherByIdUrl(publisherId));
    },

    create(data: Publisher) {
        return request(getPublisherByIdUrl(data.publisherId), {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    update(publisherId: string, data: Partial<Publisher>) {
        return request(getPublisherByIdUrl(publisherId), {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    delete(publisherId: string) {
        return request(getPublisherByIdUrl(publisherId), {
            method: "DELETE",
        });
    },

    getAuditLogs(
        publisherId: string,
        page?: number,
        limit?: number
    ): Promise<PaginatedResponse<AuditLog>> {
        return request(getPublisherAuditLogsUrl(publisherId, page, limit));
    },
};
