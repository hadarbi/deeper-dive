import { test, expect } from "@playwright/test";
import { PublishersListPage } from "./page-objects/PublishersListPage";
import { PublisherViewPage } from "./page-objects/PublisherViewPage";
import { PublisherFormPage } from "./page-objects/PublisherFormPage";
import { generateTestPublisherName } from "./helpers/testUtils";

test.describe("Publisher CRUD - Basic Flows", () => {
    test("should create a new publisher", async ({ page }) => {
        const formPage = new PublisherFormPage(page);
        const listPage = new PublishersListPage(page);
        const testName = generateTestPublisherName("E2E Test");

        await page.goto("/");
        await listPage.waitForPageLoad();
        await listPage.clickAddPublisher();
        await formPage.waitForFormToLoad();
        await formPage.fillBasicInfo({ alias: testName, isActive: true });
        await formPage.addPage({ pageType: "article", selector: ".test-widget", position: "top" });
        await formPage.fillDashboards({
            publisherDashboard: "https://example.com/publisher",
            monitorDashboard: "https://example.com/monitor",
            qaDashboard: "https://example.com/qa"
        });
        await formPage.submitForm();
        await formPage.confirmModal();

        // After creation, should return to list - verify publisher appears
        await listPage.waitForPublishersToLoad();
        await listPage.search(testName);
        const cards = await listPage.publisherCards.count();
        expect(cards).toBeGreaterThanOrEqual(1);
        await expect(listPage.publisherCards.first().locator(".publisher-title")).toContainText(testName);
    });

    test("should edit existing publisher", async ({ page }) => {
        const listPage = new PublishersListPage(page);
        await page.goto("/");
        await listPage.waitForPageLoad();
        await listPage.waitForPublishersToLoad();
        await listPage.clickEditButton(1);

        const formPage = new PublisherFormPage(page);
        await formPage.waitForFormToLoad();
        const newName = generateTestPublisherName("Edited");
        await formPage.fillBasicInfo({ alias: newName });
        await formPage.submitForm();
        await formPage.confirmModal();

        // After editing, should return to publisher view page - verify updated name appears
        const viewPage = new PublisherViewPage(page);
        await viewPage.waitForViewToLoad();
        await expect(page.locator(".publisher-title, h1")).toContainText(newName);
    });

    test("should duplicate publisher", async ({ page }) => {
        const listPage = new PublishersListPage(page);
        await page.goto("/");
        await listPage.waitForPageLoad();
        await listPage.waitForPublishersToLoad();

        const originalName = await listPage.publisherCards.first().locator(".publisher-title").textContent();

        await listPage.clickDuplicateButton(0);

        // After duplication, should return to list
        await listPage.confirmDuplicationModal();
        await listPage.waitForPublishersToLoad();

        if (originalName) {
            await listPage.search(originalName.trim());
            const count = await listPage.publisherCards.count();
            expect(count).toBeGreaterThanOrEqual(2);
        }
    });

    test("should download publisher JSON", async ({ page }) => {
        const listPage = new PublishersListPage(page);
        const viewPage = new PublisherViewPage(page);

        await page.goto("/");
        await listPage.waitForPageLoad();
        await listPage.clickPublisherCard(0);
        await viewPage.waitForViewToLoad();

        const download = await viewPage.clickDownload();
        expect(download).toBeTruthy();
        expect(download.suggestedFilename()).toContain(".json");
    });
});

