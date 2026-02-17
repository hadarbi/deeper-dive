import { Page, Publisher } from "../../../types/publisher.js";
import { generateUUID } from "../../../utils/uuid.js";
import { BasicInfoInputs } from "../sections/renderBasicInfo.js";
import { PagesInputs } from "../sections/renderPages.js";
import { DashboardsInputs } from "../sections/renderDashboards.js";
import { OptionalInputs } from "../sections/renderOptionalSettings.js";

/**
 * Derives a filename from an alias name by normalizing it
 */
function deriveFilename(aliasName: string): string {
    const formattedAlias = aliasName.trim().split(/\s+/).join("-").toLowerCase();
    return `${formattedAlias}.json`;
}

/**
 * Collects pages from the form editor
 */
function collectPagesFromEditor(pagesEditor: HTMLElement): Page[] {
    const parsedPages: Page[] = [];
    const rows = Array.from(pagesEditor.querySelectorAll(".page-row")) as HTMLElement[];

    for (const row of rows) {
        const selects = row.getElementsByTagName("select");
        const inputs = row.getElementsByTagName("input");
        const pageType = (selects[0] as HTMLSelectElement).value;
        const selector = (inputs[0] as HTMLInputElement).value;
        const position = (selects[1] as HTMLSelectElement).value;
        parsedPages.push({ pageType, selector, position });
    }

    return parsedPages;
}

/**
 * Builds a complete Publisher payload from form inputs
 */
export function buildPayloadFromForm(
    formInputs: BasicInfoInputs & PagesInputs & DashboardsInputs & OptionalInputs,
    publisher: Publisher | null
): Publisher {
    const parsedPages = collectPagesFromEditor(formInputs.pagesEditor);

    const payload: Publisher = {
        publisherId: publisher?.publisherId || generateUUID(),
        aliasName: formInputs.aliasInput.value,
        isActive: Boolean(formInputs.activeInput.checked),
        pages: parsedPages,
        publisherDashboard: formInputs.pubDashInput.value,
        monitorDashboard: formInputs.monDashInput.value,
        qaStatusDashboard: formInputs.qaDashInput.value,
        customCss: formInputs.customCssInput.value || undefined,
        tags: formInputs.tagsInput.value
            ? formInputs.tagsInput.value.split(",").map(s => s.trim()).filter(Boolean)
            : undefined,
        allowedDomains: formInputs.domainsInput.value
            ? formInputs.domainsInput.value.split(",").map(s => s.trim()).filter(Boolean)
            : undefined,
        notes: formInputs.notesInput.value || undefined,
        filename: deriveFilename(formInputs.aliasInput.value)
    };

    return payload;
}
