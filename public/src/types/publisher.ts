export interface Page {
    pageType: string;
    selector: string;
    position: string;
}

export interface Publisher {
    publisherId: string;
    aliasName: string;
    isActive: boolean;
    filename: string;

    pages: Page[];

    publisherDashboard: string;
    monitorDashboard: string;
    qaStatusDashboard: string;

    customCss?: string;
    tags?: string[];
    allowedDomains?: string[];
    notes?: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}