import { Publisher } from "../../../types/publisher.js";
import { createSection, createSectionHeader, createFormGrid, createFormField, createTextInput, createTextarea } from "./common.js";

export type OptionalInputs = {
    customCssInput: HTMLTextAreaElement;
    tagsInput: HTMLInputElement;
    domainsInput: HTMLInputElement;
    notesInput: HTMLTextAreaElement;
};

/**
 * Renders the "Optional Settings" section with additional customization fields
 */
export function renderOptionalSettings(publisher: Publisher | null): { section: HTMLElement; inputs: OptionalInputs } {
    const customCssInput = createTextarea(publisher?.customCss ?? "", "Custom CSS");
    const tagsInput = createTextInput((publisher?.tags ?? []).join(", "), "Tags (comma separated)");
    const domainsInput = createTextInput((publisher?.allowedDomains ?? []).join(", "), "Allowed domains (comma separated)");
    const notesInput = createTextarea(publisher?.notes ?? "", "Notes");

    const section = createSection();
    const header = createSectionHeader("⚙️", "Optional Settings", "Additional customization options");
    const grid = createFormGrid();
    const cssField = createFormField("Custom CSS", customCssInput);
    const tagsField = createFormField("Tags", tagsInput);
    const domainsField = createFormField("Allowed Domains", domainsInput);
    const notesField = createFormField("Notes", notesInput);

    grid.append(cssField, tagsField, domainsField, notesField);
    section.append(header, grid);
    return { section, inputs: { customCssInput, tagsInput, domainsInput, notesInput } };
}
