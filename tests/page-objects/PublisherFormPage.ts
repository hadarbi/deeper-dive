import { Page, Locator, expect } from "@playwright/test";

export class PublisherFormPage {
    readonly page: Page;
    readonly form: Locator;
    readonly aliasInput: Locator;
    readonly isActiveCheckbox: Locator;
    readonly publisherDashboardInput: Locator;
    readonly monitorDashboardInput: Locator;
    readonly qaDashboardInput: Locator;
    readonly customCssTextarea: Locator;
    readonly tagsInput: Locator;
    readonly allowedDomainsInput: Locator;
    readonly notesTextarea: Locator;
    readonly pagesContainer: Locator;
    readonly addPageButton: Locator;
    readonly customFieldsContainer: Locator;
    readonly addCustomFieldButton: Locator;
    readonly submitButton: Locator;
    readonly validationErrors: Locator;
    readonly modal: Locator;
    readonly modalConfirmButton: Locator;
    readonly modalCancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.form = page.locator("form");
        this.aliasInput = page.locator("input[placeholder*=\"alias\" i]");
        this.isActiveCheckbox = page.locator("input[type=\"checkbox\"]");
        this.publisherDashboardInput = page.locator(".form-field:has(label:text(\"Publisher Dashboard\")) input");
        this.monitorDashboardInput = page.locator(".form-field:has(label:text(\"Monitor Dashboard\")) input");
        this.qaDashboardInput = page.locator(".form-field:has(label:text(\"QA Status Dashboard\")) input");
        this.customCssTextarea = page.locator("textarea").first();
        this.tagsInput = page.locator("input[placeholder*=\"tag\" i]");
        this.allowedDomainsInput = page.locator("input[placeholder*=\"domain\" i]");
        this.notesTextarea = page.locator("textarea").last();
        this.pagesContainer = page.locator(".pages-editor");
        this.addPageButton = page.locator("button", { hasText: "Add Page" });
        this.customFieldsContainer = page.locator(".custom-fields-editor");
        this.addCustomFieldButton = page.locator("button", { hasText: "Add custom field" });
        this.submitButton = page.locator("button.primary").filter({ hasText: /Create|Update/ });
        this.validationErrors = page.locator(".inline-error");
        this.modal = page.locator(".modal, .modal-overlay .modal");
        this.modalConfirmButton = page.locator(".modal-btn-primary, button:has-text(\"Confirm\")");
        this.modalCancelButton = page.locator(".modal-btn-secondary, button:has-text(\"Cancel\")");
    }

    async waitForFormToLoad() {
        await this.page.waitForLoadState("networkidle");
        await expect(this.form).toBeVisible({ timeout: 10000 });
    }

    async fillBasicInfo(data: { alias: string; isActive?: boolean }) {
        await this.aliasInput.fill(data.alias);
        if (data.isActive !== undefined) {
            const isChecked = await this.isActiveCheckbox.isChecked();
            if (isChecked !== data.isActive) {
                await this.isActiveCheckbox.click();
            }
        }
    }

    async fillDashboards(data: {
        publisherDashboard: string;
        monitorDashboard: string;
        qaDashboard: string;
    }) {
        await this.publisherDashboardInput.fill(data.publisherDashboard);
        await this.monitorDashboardInput.fill(data.monitorDashboard);
        await this.qaDashboardInput.fill(data.qaDashboard);
    }

    async addPage(data: { pageType: string; selector: string; position: string }) {
        await this.addPageButton.click();

        const pageRows = this.pagesContainer.locator(".page-row");
        const lastRow = pageRows.last();

        await lastRow.locator("select").first().selectOption(data.pageType);
        await lastRow.locator("input[placeholder*=\"selector\" i]").fill(data.selector);
        await lastRow.locator("select").last().selectOption(data.position);
    }

    async removePage(index: number = 0) {
        const pageRows = this.pagesContainer.locator(".page-row");
        await pageRows.nth(index).locator("button", { hasText: "Remove" }).click();
    }

    async addCustomField(key: string, value: string) {
        await this.addCustomFieldButton.click();

        const fieldRows = this.customFieldsContainer.locator(".custom-field-row");
        const lastRow = fieldRows.last();

        const inputs = await lastRow.locator("input").all();
        await inputs[0].fill(key);
        await inputs[1].fill(value);
    }

    async fillOptionalFields(data: {
        customCss?: string;
        tags?: string;
        allowedDomains?: string;
        notes?: string;
    }) {
        if (data.customCss) {
            const textareas = await this.page.locator("textarea").all();
            if (textareas.length > 0) await textareas[0].fill(data.customCss);
        }

        if (data.tags) {
            await this.tagsInput.fill(data.tags);
        }

        if (data.allowedDomains) {
            await this.allowedDomainsInput.fill(data.allowedDomains);
        }

        if (data.notes) {
            const textareas = await this.page.locator("textarea").all();
            if (textareas.length > 0) await textareas[textareas.length - 1].fill(data.notes);
        }
    }

    async submitForm() {
        await this.submitButton.click();
    }

    async confirmModal() {
        // Wait a bit longer for modal to appear after form submission
        await expect(this.modal).toBeVisible({ timeout: 10000 });
        await this.modalConfirmButton.click();
        await this.page.waitForLoadState("networkidle");
    }

    async cancelModal() {
        await expect(this.modal).toBeVisible();
        await this.modalCancelButton.click();
    }

    async expectValidationError(message: string) {
        await expect(this.validationErrors.filter({ hasText: message })).toBeVisible();
    }

    async expectNoValidationErrors() {
        await expect(this.validationErrors).toHaveCount(0);
    }

    async expectSubmitButtonDisabled() {
        await expect(this.submitButton).toBeDisabled();
    }

    async expectSubmitButtonEnabled() {
        await expect(this.submitButton).toBeEnabled();
    }
}
