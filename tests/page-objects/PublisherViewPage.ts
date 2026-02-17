import { Page, Locator, expect } from "@playwright/test";

export class PublisherViewPage {
    readonly page: Page;
    readonly breadcrumb: Locator;
    readonly publisherName: Locator;
    readonly statusBadge: Locator;
    readonly editButton: Locator;
    readonly downloadButton: Locator;
    readonly statsCards: Locator;
    readonly pagesCards: Locator;
    readonly dashboardLinks: Locator;
    readonly tagPills: Locator;
    readonly domainChips: Locator;
    readonly notesSection: Locator;

    constructor(page: Page) {
        this.page = page;
        this.breadcrumb = page.locator(".breadcrumb");
        this.publisherName = page.locator(".publisher-title");
        this.statusBadge = page.locator(".status-badge");
        this.editButton = page.locator("button.btn-primary", { hasText: "Edit" });
        this.downloadButton = page.locator("button.btn-secondary", { hasText: "Download" });
        this.statsCards = page.locator(".stat-card");
        this.pagesCards = page.locator(".page-card");
        this.dashboardLinks = page.locator(".dashboard-link");
        this.tagPills = page.locator(".tag-pill");
        this.domainChips = page.locator(".domain-chip");
        this.notesSection = page.locator(".notes-content");
    }

    async waitForViewToLoad() {
        await this.page.waitForLoadState("networkidle");
        await expect(this.editButton).toBeVisible({ timeout: 10000 });
    }

    async clickEdit() {
        await this.editButton.click();
        // Wait for form to appear (SPA - no URL change)
        await this.page.waitForLoadState("networkidle");
    }

    async clickDownload() {
        const downloadPromise = this.page.waitForEvent("download");
        await this.downloadButton.click();
        const download = await downloadPromise;
        return download;
    }

    async clickBreadcrumbHome() {
        await this.breadcrumb.locator(".clickable").first().click();
        await this.page.waitForURL("/");
    }

    async expectPublisherName(name: string) {
        await expect(this.publisherName).toContainText(name);
    }

    async expectStatusBadge(status: "Active" | "Inactive") {
        await expect(this.statusBadge).toContainText(status);
    }

    async expectPagesCount(count: number) {
        await expect(this.pagesCards).toHaveCount(count);
    }

    async expectTagsVisible(tags: string[]) {
        for (const tag of tags) {
            await expect(this.tagPills.filter({ hasText: tag })).toBeVisible();
        }
    }
}
