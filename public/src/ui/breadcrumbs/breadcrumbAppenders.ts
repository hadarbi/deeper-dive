import { createElement } from "../../utils/dom.js";
import { showConfirmDialog } from "../modal.js";
import { setState, getState } from "../../state/store.js";
import { Publisher } from "../../types/publisher.js";

function appendSeparator(breadcrumbs: HTMLElement): void {
    breadcrumbs.append(createElement("span", "breadcrumb-separator", " > "));
}

function createPublisherBreadcrumbLink(publisher: Publisher): HTMLAnchorElement {
    const publisherAliasLink = createElement("a", "breadcrumb-link", publisher.aliasName) as HTMLAnchorElement;
    publisherAliasLink.href = "#";
    return publisherAliasLink;
}

export function appendCreatePublisherBreadcrumb(breadcrumbs: HTMLElement): void {
    appendSeparator(breadcrumbs);
    breadcrumbs.append(createElement("span", "breadcrumb-current", "Create Publisher"));
}

export function appendPublisherBreadcrumb(
    breadcrumbs: HTMLElement,
    publisher: Publisher,
    hasUnsavedChangesCheck: (() => boolean) | undefined,
): void {
    const { isInCreateOrEditMode } = getState();

    const publisherAliasLink = createPublisherBreadcrumbLink(publisher);
    appendSeparator(breadcrumbs);
    breadcrumbs.append(publisherAliasLink);

    if (isInCreateOrEditMode) {
        appendSeparator(breadcrumbs);
        breadcrumbs.append(createElement("span", "breadcrumb-current", "Edit"));

        publisherAliasLink.onclick = async (e) => {
            e.preventDefault();
            if (hasUnsavedChangesCheck && hasUnsavedChangesCheck()) {
                const confirmed = await showConfirmDialog(
                    "Unsaved Changes",
                    "You have unsaved changes. Are you sure you want to leave? Your changes will not be saved."
                );
                if (!confirmed) return;
            }
            setState({ isInCreateOrEditMode: false });
        };
    }
}
