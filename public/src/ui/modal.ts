import { createElement } from "../utils/dom.js";

export function showConfirmDialog(title: string, message: string, emoji: string = "⚠️"): Promise<boolean> {
    return showConfirmDialogWithChanges(title, message, emoji, []);
}

export function showConfirmDialogWithChanges(
    title: string,
    message: string,
    emoji: string = "⚠️",
    changes: string[] = []
): Promise<boolean> {
    return new Promise((resolve) => {
        const overlay = createElement("div", "modal-overlay");
        const dialog = createElement("div", "modal");

        const iconWrapper = createElement("div", "modal-icon");
        iconWrapper.textContent = emoji;

        const heading = createElement("h2", "modal-title", title);
        const messageElement = createElement("p", "modal-message", message);

        // Build changes list if provided
        let changesElement: HTMLElement | null = null;
        if (changes.length > 0) {
            changesElement = createElement("div", "modal-changes");
            const changesTitle = createElement("p", "modal-changes-title", "Changes:");
            const changesList = createElement("ul", "modal-changes-list");
            
            for (const change of changes) {
                const li = createElement("li", "modal-change-item", change);
                changesList.appendChild(li);
            }
            
            changesElement.append(changesTitle, changesList);
        }

        const buttons = createElement("div", "modal-buttons");
        const ok = createElement("button", "modal-btn modal-btn-primary", "Confirm") as HTMLButtonElement;
        const cancel = createElement("button", "modal-btn modal-btn-secondary", "Cancel") as HTMLButtonElement;

        ok.onclick = () => {
            document.body.removeChild(overlay);
            resolve(true);
        };
        cancel.onclick = () => {
            document.body.removeChild(overlay);
            resolve(false);
        };

        buttons.append(cancel, ok);
        dialog.append(iconWrapper, heading, messageElement);
        if (changesElement) {
            dialog.append(changesElement);
        }
        dialog.append(buttons);
        overlay.append(dialog);
        document.body.append(overlay);

        // Animate in
        requestAnimationFrame(() => {
            overlay.style.opacity = "1";
            dialog.style.transform = "scale(1)";
        });
    });
}
