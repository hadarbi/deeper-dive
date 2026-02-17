import { createElement } from "../../../utils/dom.js";
import { navigate, RouteKey } from "../../../state/router.js";
import { publisherService } from "../../../services/publisherService.js";
import { showConfirmDialog } from "../../modal.js";
import { generateUUID } from "../../../utils/uuid.js";
import { fetchPublishers } from "../../../handlers/handleFetchPublishers.js";
import { setState } from "../../../state/store.js";

function createEditButton(publisherId: string): HTMLButtonElement {
    const editBtn = createElement("button", "publisher-action-btn") as HTMLButtonElement;
    editBtn.innerHTML = "✏️";
    editBtn.title = "Edit publisher";
    editBtn.onclick = (e) => {
        e.stopPropagation();
        console.log("Edit publisher clicked");
        setState({ isInCreateOrEditMode: true });
        navigate(RouteKey.PUBLISHER_PAGE, { publisherId });
    };
    return editBtn;
}

function createDuplicateButton(publisherId: string, aliasName: string): HTMLButtonElement {
    const duplicateBtn = createElement("button", "publisher-action-btn") as HTMLButtonElement;
    duplicateBtn.innerHTML = "📋";
    duplicateBtn.title = "Duplicate publisher";
    duplicateBtn.onclick = async (e) => {
        e.stopPropagation();
        try {
            const confirmed = await showConfirmDialog(
                "Duplicate Publisher",
                `Are you sure you want to duplicate "${aliasName}"?`
            );
            if (!confirmed) return;

            const publisher = await publisherService.getById(publisherId);

            const copyAliasName = `${publisher.aliasName} (Copy)`;

            const copiedPublisher = {
                ...publisher,
                publisherId: generateUUID(),
                aliasName: copyAliasName,
            };

            // Create the duplicated publisher
            await publisherService.create(copiedPublisher);

            // Refetch the publishers list to include the new duplicate
            fetchPublishers();
        } catch (error) {
            console.error("Failed to duplicate publisher:", error);
            alert("Failed to duplicate publisher. Please try again.");
        }
    };
    return duplicateBtn;
}

function createDeleteButton(publisherId: string, aliasName: string): HTMLButtonElement {
    const deleteBtn = createElement("button", "publisher-action-btn") as HTMLButtonElement;
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.title = "Delete publisher";
    deleteBtn.onclick = async (e) => {
        e.stopPropagation();
        try {
            const confirmed = await showConfirmDialog(
                "Delete Publisher",
                `Are you sure you want to delete "${aliasName}"? This action cannot be undone.`
            );
            if (!confirmed) return;

            // Delete the publisher
            await publisherService.delete(publisherId);

            // Refresh the page to show the updated list
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete publisher:", error);
            alert("Failed to delete publisher. Please try again.");
        }
    };
    return deleteBtn;
}

export function renderCardActions(publisherId: string, aliasName: string): HTMLElement {
    const actions = createElement("div", "publisher-actions");
    actions.append(
        createEditButton(publisherId),
        createDuplicateButton(publisherId, aliasName),
        createDeleteButton(publisherId, aliasName)
    );
    return actions;
}
