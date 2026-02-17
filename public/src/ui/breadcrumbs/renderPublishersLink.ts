import { navigate, RouteKey } from "../../state/router.js";
import { setState } from "../../state/store.js";
import { createElement } from "../../utils/dom.js";
import { showConfirmDialog } from "../modal.js";

export function renderPublishersLink(
    hasUnsavedChangesCheck: (() => boolean) | undefined,
    isInNewPublisherMode: boolean
): HTMLAnchorElement {
    const publishersLink = createElement("a", "breadcrumb-link", "Publishers") as HTMLAnchorElement;
    publishersLink.href = "#";
    publishersLink.onclick = async (e) => {
        e.preventDefault();
        if (hasUnsavedChangesCheck && hasUnsavedChangesCheck()) {
            const confirmed = await showConfirmDialog(
                "Unsaved Changes",
                "Are you sure you want to leave? Your changes will not be saved.",
                isInNewPublisherMode ? "💭" : "⚠️"
            );
            if (!confirmed) return;
        }
        setState({ isInCreateOrEditMode: false });
        navigate(RouteKey.PUBLISHERS);
    };
    return publishersLink;
}
