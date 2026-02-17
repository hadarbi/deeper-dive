import { Page, Publisher } from "../../../types/publisher.js";
import { createElement } from "../../../utils/dom.js";
import { createSection, createSectionHeader } from "./common.js";
import { PAGE_TYPES, POSITIONS } from "../../../constants/publisher.js";

export type PagesInputs = {
    pagesEditor: HTMLElement;
};

/**
 * Creates a single page configuration row (pageType, selector, position)
 */
function createPageRow(pagesEditor: HTMLElement, page?: Page): HTMLElement {
    const row = createElement("div", "page-row");

    // Page type select
    const typeSelect = createElement("select") as HTMLSelectElement;
    typeSelect.required = false;
    PAGE_TYPES.forEach(pageType => {
        const option = document.createElement("option");
        option.value = pageType;
        option.textContent = pageType;
        if (page?.pageType === pageType) option.selected = true;
        typeSelect.append(option);
    });

    // Selector input
    const selectorInput = createElement("input") as HTMLInputElement;
    selectorInput.placeholder = "Selector";
    selectorInput.value = page?.selector ?? "";
    selectorInput.required = false;

    // Position select
    const posSelect = createElement("select") as HTMLSelectElement;
    posSelect.required = false;
    POSITIONS.forEach(position => {
        const option = document.createElement("option");
        option.value = position;
        option.textContent = position;
        if (page?.position === position) option.selected = true;
        posSelect.append(option);
    });

    // Remove button
    const removeBtn = createElement("button", "", "Remove") as HTMLButtonElement;
    removeBtn.type = "button";
    removeBtn.onclick = (e) => {
        e.preventDefault();
        pagesEditor.removeChild(row);
    };

    // Wrap inputs in containers so errors can appear below without breaking grid
    const typeWrapper = createElement("div", "field-wrapper");
    typeWrapper.appendChild(typeSelect);

    const selectorWrapper = createElement("div", "field-wrapper");
    selectorWrapper.appendChild(selectorInput);

    const posWrapper = createElement("div", "field-wrapper");
    posWrapper.appendChild(posSelect);

    row.append(typeWrapper, selectorWrapper, posWrapper, removeBtn);
    return row;
}

/**
 * Renders the "Page Configurations" section with page rows
 */
export function renderPages(publisher: Publisher | null): { section: HTMLElement; inputs: PagesInputs } {
    const pagesEditor = createElement("div", "pages-editor");

    // Initialize with existing pages
    const initialPages = publisher?.pages ?? [];
    initialPages.forEach(page => {
        pagesEditor.append(createPageRow(pagesEditor, page));
    });

    const section = createSection();
    const header = createSectionHeader(
        "📄",
        "Page Configurations (Required)",
        "Define where content appears on different page types - at least one is required"
    );

    const addPageBtn = createElement("button", "add-row-btn", "Add Page") as HTMLButtonElement;
    addPageBtn.type = "button";
    addPageBtn.onclick = (e) => {
        e.preventDefault();
        pagesEditor.append(createPageRow(pagesEditor));
    };

    section.append(header, pagesEditor, addPageBtn);
    return { section, inputs: { pagesEditor } };
}
