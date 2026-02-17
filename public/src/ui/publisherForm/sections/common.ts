import { createElement } from "../../../utils/dom.js";

export function createTextInput(value: string, placeholder: string): HTMLInputElement {
    const input = createElement("input") as HTMLInputElement;
    input.value = value;
    input.placeholder = placeholder;
    input.required = false;
    return input;
}

export function createTextarea(value: string, placeholder: string): HTMLTextAreaElement {
    const textarea = createElement("textarea") as HTMLTextAreaElement;
    textarea.value = value;
    textarea.placeholder = placeholder;
    return textarea;
}

export function createSectionHeader(icon: string, title: string, description: string): HTMLElement {
    const header = createElement("div", "form-section-header");
    const iconEl = createElement("div", "form-section-icon", icon);
    const titleEl = createElement("div", "form-section-title");
    titleEl.append(
        createElement("h2", "", title),
        createElement("p", "", description)
    );
    header.append(iconEl, titleEl);
    return header;
}

export function createSection(): HTMLElement {
    return createElement("div", "form-section");
}

export function createFormGrid(): HTMLElement {
    return createElement("div", "form-grid");
}

export function createFormField(labelText: string, inputElement: HTMLElement): HTMLElement {
    const field = createElement("div", "form-field");
    const label = createElement("label", "", labelText);
    field.append(label, inputElement);
    return field;
}
