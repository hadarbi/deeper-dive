import { Publisher } from "../../types/publisher.js";
import { createElement } from "../../utils/dom.js";
import { renderFormHero } from "./hero.js";
import { renderBasicInfo, BasicInfoInputs } from "./sections/renderBasicInfo.js";
import { renderPages, PagesInputs } from "./sections/renderPages.js";
import { renderDashboards, DashboardsInputs } from "./sections/renderDashboards.js";
import { renderOptionalSettings, OptionalInputs } from "./sections/renderOptionalSettings.js";
import { renderFormFooter } from "./sections/renderFormFooter.js";
import { buildPayloadFromForm } from "./logic/payloadBuilder.js";
import { handleFormSubmit } from "./logic/formSubmission.js";
import { hasFormContent, hasChangedFromSnapshot, hasUnsavedChanges } from "./logic/identifyChange.js";

type FormInputs = BasicInfoInputs & PagesInputs & DashboardsInputs & OptionalInputs;

function updateSubmitButtonState(
    submitButton: HTMLButtonElement,
    formInputs: FormInputs,
    publisher: Publisher | null,
    initialSnapshot: string | null
): void {
    if (publisher) {
        // For existing publishers, disable if no changes
        const hasChanges = initialSnapshot && hasChangedFromSnapshot(formInputs, initialSnapshot, publisher);
        submitButton.disabled = !hasChanges;
        submitButton.title = hasChanges ? "" : "No changes to save";
    } else {
        // For new publishers, disable Create button if nothing has been filled
        const hasContent = hasFormContent(formInputs);
        submitButton.disabled = !hasContent;
        submitButton.title = hasContent ? "" : "Fill in at least one field to create";
    }
}

export function renderPublisherForm(
    publisher: Publisher | null,
): { wrapper: HTMLElement; hasUnsavedChanges: () => boolean } {


    // Create form element
    const form = createElement("form", "form");
    form.noValidate = true; // Use our own validation instead of browser's

    // Render all form sections independently
    const sections = [
        renderBasicInfo(publisher),
        renderPages(publisher),
        renderDashboards(publisher),
        renderOptionalSettings(publisher)
    ];

    const { footer, submitButton } = renderFormFooter(publisher);

    // Combine all inputs into single object
    const formInputs = sections.reduce((acc, { inputs }) => ({ ...acc, ...inputs }), {}) as FormInputs;

    // Build form layout
    const formCard = createElement("div", "form-card");
    sections.forEach(({ section }) => formCard.append(section));
    formCard.append(footer);
    form.append(formCard);

    // Set up form submission handler
    submitButton.onclick = () => handleFormSubmit(form, formInputs, publisher);

    // Set up change detection
    const initialSnapshot = publisher ? JSON.stringify(buildPayloadFromForm(formInputs, publisher)) : null;

    const checkDirty = () => {
        updateSubmitButtonState(submitButton, formInputs, publisher, initialSnapshot);
    };

    form.addEventListener("input", checkDirty);
    form.addEventListener("change", checkDirty);
    form.addEventListener("click", () => setTimeout(checkDirty, 0));

    // Set initial button state
    checkDirty();

    // Create wrapper and add hero + form
    const wrapper = createElement("div", "create-publisher-wrapper");
    const hero = renderFormHero(!publisher, publisher?.aliasName);
    wrapper.append(hero, form);

    return {
        wrapper,
        hasUnsavedChanges: () => hasUnsavedChanges(formInputs, publisher, initialSnapshot)
    };
}
