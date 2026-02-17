import { test, expect } from "@playwright/test";
import { PublishersListPage } from "./page-objects/PublishersListPage";
import { PublisherViewPage } from "./page-objects/PublisherViewPage";

test.describe("Publishers List - Basic Flows", () => {
    let listPage: PublishersListPage;

    test.beforeEach(async ({ page }) => {
        listPage = new PublishersListPage(page);
        await page.goto("/");
        await listPage.waitForPageLoad();
    });

    test("should load and display publishers list", async () => {
        await listPage.waitForPublishersToLoad();
        await expect(listPage.publishersGrid).toBeVisible();
        const count = await listPage.publisherCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test("should search publishers by name", async () => {
        await listPage.waitForPublishersToLoad();
        await listPage.search("atlas");
        const firstCard = listPage.publisherCards.first();
        await expect(firstCard).toContainText(/atlas/i);
    });

    test("should navigate to publisher view when clicking card", async ({ page }) => {
        await listPage.waitForPublishersToLoad();
        await listPage.clickPublisherCard(0);

        const viewPage = new PublisherViewPage(page);
        await viewPage.waitForViewToLoad();
        await expect(viewPage.editButton).toBeVisible();
        await expect(viewPage.downloadButton).toBeVisible();
    });
});
