import { createElement } from "../../utils/dom.js";
import { renderPublisherCard } from "./publisherCard/publisherCard.js";
import { Publisher } from "../../types/publisher.js";

export function renderLoadingState() {
    const grid = createElement("div", "grid");
    for (let i = 0; i < 6; i++) {
        const skeleton = createElement("div", "skeleton-card");
        const skeletonHeader = createElement("div", "skeleton-header");
        const skeletonAvatar = createElement("div", "skeleton-avatar");
        const skeletonText = createElement("div", "skeleton-text");
        const line1 = createElement("div", "skeleton-line");
        const line2 = createElement("div", "skeleton-line short");
        skeletonText.append(line1, line2);
        skeletonHeader.append(skeletonAvatar, skeletonText);
        skeleton.append(skeletonHeader);
        grid.append(skeleton);
    }
    return grid;
}

export function renderErrorState(error: string) {
    return createElement("p", "error", error);
}

export function renderEmptyState(search: string) {
    return createElement("div", "info",
        search ? `No publishers found for "${search}"` : "No publishers yet. Create your first publisher to get started!");
}

export function renderPublishersGrid(publishers: Publisher[]) {
    const grid = createElement("div", "grid");
    publishers.forEach(p => grid.append(renderPublisherCard(p)));
    return grid;
}
