import { Publisher } from "../../../types/publisher.js";
import { createElement } from "../../../utils/dom.js";

/**
 * Renders the form footer with submit button
 */
export function renderFormFooter(publisher: Publisher | null): { footer: HTMLElement; submitButton: HTMLButtonElement } {
    const submitButton = createElement("button", "primary", publisher ? "Update" : "Create Publisher") as HTMLButtonElement;
    submitButton.setAttribute("type", "button");

    const footer = createElement("div", "form-actions-footer");
    footer.append(submitButton);

    return { footer, submitButton };
}
