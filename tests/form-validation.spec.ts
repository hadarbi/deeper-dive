import { test, expect } from "@playwright/test";
import { PublisherFormPage } from "./page-objects/PublisherFormPage";
import { PublishersListPage } from "./page-objects/PublishersListPage";

test.describe("Form Validation - Basic Flows", () => {
    let formPage: PublisherFormPage;
    let listPage: PublishersListPage;

    test.beforeEach(async ({ page }) => {
        formPage = new PublisherFormPage(page);
        listPage = new PublishersListPage(page);

        await page.goto("/");
        await listPage.waitForPageLoad();
        await listPage.clickAddPublisher();
        await formPage.waitForFormToLoad();
    });

    test("should show error when submitting without required fields", async () => {
        // Fill and then clear the alias field to enable the submit button
        await formPage.aliasInput.fill("test");
        await formPage.submitForm();

        // Check for all expected validation error messages
        const expectedErrors = [
            "Publisher dashboard URL is required",
            "Monitor dashboard URL is required",
            "QA status dashboard URL is required",
            "At least one page configuration is required"
        ];

        for (const errorMessage of expectedErrors) {
            await expect(formPage.page.locator(".inline-error", { hasText: errorMessage })).toBeVisible();
        }
    });
});
