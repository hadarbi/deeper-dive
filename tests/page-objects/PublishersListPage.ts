import { Page, Locator, expect } from "@playwright/test";

export class PublishersListPage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchSubmitButton: Locator;
    readonly addPublisherButton: Locator;
    readonly publishersGrid: Locator;
    readonly publisherCards: Locator;
    readonly resultsCount: Locator;
    readonly loadingSkeleton: Locator;
    readonly filterAll: Locator;
    readonly filterActive: Locator;
    readonly filterInactive: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator("input[type=\"search\"]");
        this.searchSubmitButton = page.locator("button", { hasText: "Search" });
        this.addPublisherButton = page.locator("button.primary", { hasText: "Add Publisher" });
        this.publishersGrid = page.locator(".grid");
        this.publisherCards = page.locator(".publisher-card");
        this.resultsCount = page.locator(".results-count");
        this.loadingSkeleton = page.locator(".skeleton-card");
        this.filterAll = page.locator(".filter-chip").filter({ hasText: "All" });
        this.filterActive = page.locator(".filter-chip").filter({ hasText: "Active" });
        this.filterInactive = page.locator(".filter-chip").filter({ hasText: "Inactive" });
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState("networkidle");
        await expect(this.publishersGrid).toBeVisible({ timeout: 10000 });
    }

    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchSubmitButton.click();
        await this.page.waitForTimeout(250);
    }

    async clickAddPublisher() {
        await this.addPublisherButton.click();
        // Wait for form to appear (SPA - no URL change)
        await this.page.waitForLoadState("networkidle");
    }

    async clickPublisherCard(index: number = 0) {
        await this.publisherCards.nth(index).click();
        await this.page.waitForLoadState("networkidle");
    }

    async clickEditButton(index: number = 0) {
        await this.publisherCards.nth(index).locator("button").filter({ hasText: "✏️" }).click();
        await this.page.waitForLoadState("networkidle");
    }

    async clickDuplicateButton(index: number = 0) {
        await this.publisherCards.nth(index).locator("button").filter({ hasText: "📋" }).click();
    }

    async getPublisherCardByName(name: string): Promise<Locator> {
        return this.publisherCards.filter({ has: this.page.locator(".publisher-title", { hasText: name }) });
    }

    async expectPublisherCount(count: number) {
        await expect(this.publisherCards).toHaveCount(count);
    }

    async expectResultsCountText(text: string) {
        await expect(this.resultsCount).toContainText(text);
    }

    async expectNoPublishersFound() {
        await expect(this.page.locator("text=No publishers found")).toBeVisible();
    }

    async waitForPublishersToLoad() {
        await expect(this.loadingSkeleton).not.toBeVisible({ timeout: 5000 });
        await expect(this.publishersGrid).toBeVisible();
    }
    async confirmDuplicationModal() {
        const modal = this.page.locator(".modal");
        const confirmButton = modal.locator(".modal-btn-primary", { hasText: "Confirm" });
        await expect(modal).toBeVisible({ timeout: 10000 });
        await confirmButton.click();
        await this.page.waitForLoadState("networkidle");
    }
}
