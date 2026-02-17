import { Page } from "@playwright/test";

export async function waitForApiResponse(page: Page, endpoint: string) {
    return page.waitForResponse(response =>
        response.url().includes(endpoint) && response.status() === 200
    );
}

export async function waitForNavigation(page: Page) {
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(100); // Small buffer for animations
}

export function generateTestPublisherName(prefix: string = "Test Publisher"): string {
    const timestamp = Date.now();
    return `${prefix} ${timestamp}`;
}

export interface TestPublisher {
    alias: string;
    isActive: boolean;
    publisherDashboard: string;
    monitorDashboard: string;
    qaStatusDashboard: string;
    pages: Array<{
        pageType: string;
        selector: string;
        position: string;
    }>;
    [key: string]: unknown;
}

export function createTestPublisher(overrides: Partial<TestPublisher> = {}): TestPublisher {
    const timestamp = Date.now();
    return {
        alias: `Test Publisher ${timestamp}`,
        isActive: true,
        publisherDashboard: "https://example.com/publisher",
        monitorDashboard: "https://example.com/monitor",
        qaStatusDashboard: "https://example.com/qa",
        pages: [
            {
                pageType: "article",
                selector: ".test-selector",
                position: "top"
            }
        ],
        ...overrides
    };
}

export async function cleanupTestPublisher(page: Page, filename: string) {
    // Note: This would require a DELETE endpoint on the backend
    // Currently, we'll rely on manual cleanup or test data isolation
    console.log(`Cleanup needed for: ${filename}`);
}

export async function waitForStable(page: Page, selector: string, timeout: number = 1000) {
    await page.locator(selector).waitFor({ state: "visible" });
    await page.waitForTimeout(timeout);
}
