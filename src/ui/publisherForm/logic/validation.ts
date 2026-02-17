import { Page, Publisher } from "../../../types/publisher.js";
import { createElement } from "../../../utils/dom.js";

export interface FormInputs {
    aliasInput: HTMLInputElement;
    activeInput: HTMLInputElement;
    activeLabel: HTMLElement;
    pubDashInput: HTMLInputElement;
    monDashInput: HTMLInputElement;
    qaDashInput: HTMLInputElement;
    customCssInput: HTMLTextAreaElement;
    tagsInput: HTMLInputElement;
    domainsInput: HTMLInputElement;
    notesInput: HTMLTextAreaElement;
    pagesEditor: HTMLElement;
}

export function isValidUrl(urlString?: string): boolean {
    if (!urlString) return false;
    try {
        const url = new URL(urlString);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export function runInlineValidation(
    payload: Partial<Publisher>,
): Record<string, string> {
    const errors: Record<string, string> = {};

    // Basic validations
    if (!payload.aliasName || !String(payload.aliasName).trim()) {
        errors["aliasName"] = "Alias is required";
    } else {
        const aliasName = String(payload.aliasName).trim();
        if (aliasName.length < 3) {
            errors["aliasName"] = "Name must contain at least 3 characters";
        } else if (!/[a-zA-Z]/.test(aliasName)) {
            errors["aliasName"] = "Name must include English characters";
        }
    }
    if (typeof payload.isActive !== "boolean") {
        errors["isActive"] = "isActive must be set";
    }

    // Dashboard URL validations
    const dashboardFields = [
        { key: "publisherDashboard" as keyof Publisher, label: "Publisher dashboard" },
        { key: "monitorDashboard" as keyof Publisher, label: "Monitor dashboard" },
        { key: "qaStatusDashboard" as keyof Publisher, label: "QA status dashboard" }
    ];

    dashboardFields.forEach(({ key, label }) => {
        const value = payload[key];
        if (!value || !String(value).trim()) {
            errors[key] = `${label} URL is required`;
        } else if (!isValidUrl(String(value))) {
            errors[key] = "Must be a valid url";
        }
    });

    // Pages validation
    if (!Array.isArray(payload.pages) || payload.pages.length === 0) {
        errors["pages"] = "At least one page configuration is required";
    } else {
        payload.pages.forEach((page: Page, index: number) => {
            if (!page.pageType) {
                errors[`pages.${index}.pageType`] = "pageType is required";
            }
            if (!page.selector || !String(page.selector).trim()) {
                errors[`pages.${index}.selector`] = "selector is required";
            }
            if (!page.position) {
                errors[`pages.${index}.position`] = "position is required";
            }
        });
    }

    return errors;
}

export function clearFormErrors(form: HTMLFormElement): void {
    const previousErrors = form.querySelectorAll(".inline-error");
    previousErrors.forEach(node => node.remove());

    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((element: Element) => {
        (element as HTMLElement).style.border = "";
    });
}

export function showFieldError(target: HTMLElement, message: string): void {
    target.style.border = "2px solid var(--error)";
    const errorMessage = createElement("div", "inline-error", message) as HTMLElement;

    if (target.nextSibling) {
        target.parentNode!.insertBefore(errorMessage, target.nextSibling);
    } else {
        target.parentNode!.appendChild(errorMessage);
    }
}

export function displayValidationErrors(
    form: HTMLFormElement,
    errors: Record<string, string>,
    inputs: FormInputs
): void {
    for (const [errorKey, errorMessage] of Object.entries(errors)) {
        if (errorKey.startsWith("pages.")) {
            const parts = errorKey.split(".");
            const index = Number(parts[1]);
            const field = parts[2];
            const row = inputs.pagesEditor.querySelectorAll(".page-row")[index] as HTMLElement | undefined;

            if (row) {
                const wrappers = row.querySelectorAll(".field-wrapper");
                const fieldMap = { selector: 1, pageType: 0, position: 2 };
                const wrapperIndex = fieldMap[field as keyof typeof fieldMap];

                if (wrappers[wrapperIndex]) {
                    const wrapper = wrappers[wrapperIndex] as HTMLElement;
                    const element = (field === "selector"
                        ? wrapper.getElementsByTagName("input")[0]
                        : wrapper.getElementsByTagName("select")[0]) as HTMLElement;
                    showFieldError(element, errorMessage);
                }
            }
        } else if (errorKey === "pages") {
            showFieldError(inputs.pagesEditor, errorMessage);
        } else {
            // Top-level fields
            const fieldMap: Record<string, HTMLInputElement> = {
                aliasName: inputs.aliasInput,
                publisherDashboard: inputs.pubDashInput,
                monitorDashboard: inputs.monDashInput,
                qaStatusDashboard: inputs.qaDashInput
            };

            const targetInput = fieldMap[errorKey];
            if (targetInput) {
                showFieldError(targetInput, errorMessage);
            }
        }
    }
}
