import { Publisher } from "../../../types/publisher.js";
import { createElement } from "../../../utils/dom.js";
import { createSection, createSectionHeader, createFormGrid, createFormField, createTextInput } from "./common.js";

export type BasicInfoInputs = {
    aliasInput: HTMLInputElement;
    activeInput: HTMLInputElement;
    activeLabel: HTMLLabelElement;
};

/**
 * Renders the "Basic Information" section with publisher name and status
 */
export function renderBasicInfo(publisher: Publisher | null): { section: HTMLElement; inputs: BasicInfoInputs } {
    const aliasInput = createTextInput(publisher?.aliasName ?? "", "Publisher alias");

    const activeInput = createElement("input") as HTMLInputElement;
    activeInput.type = "checkbox";
    activeInput.checked = publisher?.isActive ?? true;

    const activeLabel = createElement("label", "checkbox-label") as HTMLLabelElement;
    activeLabel.append(activeInput, createElement("span", "", " Active"));

    const section = createSection();
    const header = createSectionHeader("📝", "Basic Information", "Start with the publisher name and status");
    const grid = createFormGrid();
    const aliasField = createFormField("Publisher Name", aliasInput);
    grid.append(aliasField, activeLabel);

    section.append(header, grid);
    return { section, inputs: { aliasInput, activeInput, activeLabel } };
}
