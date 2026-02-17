import { createElement } from "../../utils/dom.js";
import { Publisher } from "../../types/publisher.js";
import { renderPublishersLink } from "./renderPublishersLink.js";
import { appendCreatePublisherBreadcrumb, appendPublisherBreadcrumb } from "./breadcrumbAppenders.js";

export function renderBreadcrumbs(
    publisher: Publisher | null,
    isInNewPublisherMode: boolean,
    hasUnsavedChangesCheck: (() => boolean) | undefined,
) {
    const breadcrumbs = createElement("div", "breadcrumbs");
    const publishersLink = renderPublishersLink(
        hasUnsavedChangesCheck,
        isInNewPublisherMode
    );
    breadcrumbs.append(publishersLink);

    if (isInNewPublisherMode) {
        appendCreatePublisherBreadcrumb(breadcrumbs);
    } else if (publisher) {
        appendPublisherBreadcrumb(
            breadcrumbs,
            publisher,
            hasUnsavedChangesCheck,
        );
    }

    return breadcrumbs;
}
