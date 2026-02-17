import { BasicInfoInputs } from "../sections/renderBasicInfo.js";
import { PagesInputs } from "../sections/renderPages.js";
import { DashboardsInputs } from "../sections/renderDashboards.js";
import { OptionalInputs } from "../sections/renderOptionalSettings.js";
import { buildPayloadFromForm } from "./payloadBuilder.js";
import { Publisher } from "../../../types/publisher.js";


export function hasFormContent(
    formInputs: BasicInfoInputs & PagesInputs & DashboardsInputs & OptionalInputs
): boolean {
    const textInputs = [
        formInputs.aliasInput,
        formInputs.pubDashInput,
        formInputs.monDashInput,
        formInputs.qaDashInput,
        formInputs.customCssInput,
        formInputs.tagsInput,
        formInputs.domainsInput,
        formInputs.notesInput
    ];

    const hasTextValue = textInputs.some(input => input.value.trim().length > 0);
    const hasPages = formInputs.pagesEditor.querySelectorAll(".page-row").length > 0;

    return hasTextValue || hasPages;
}

export function hasChangedFromSnapshot(
    formInputs: BasicInfoInputs & PagesInputs & DashboardsInputs & OptionalInputs,
    initialSnapshot: string,
    publisher: Publisher | null
): boolean {
    const current = JSON.stringify(buildPayloadFromForm(formInputs, publisher));
    return current !== initialSnapshot;
}


export function hasUnsavedChanges(
    formInputs: BasicInfoInputs & PagesInputs & DashboardsInputs & OptionalInputs,
    publisher: Publisher | null,
    initialSnapshot: string | null
): boolean {
    if (!publisher) {
        return hasFormContent(formInputs);
    }
    return initialSnapshot ? hasChangedFromSnapshot(formInputs, initialSnapshot, publisher) : false;
}
