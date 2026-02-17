import { createElement } from "../../utils/dom.js";

/**
 * Renders the hero section at the top of the form
 */
export function renderFormHero(isInNewPublisherMode: boolean, publisherName?: string): HTMLElement {
    const hero = createElement("div", "create-publisher-hero");

    if (isInNewPublisherMode) {
        hero.append(
            createElement("h1", "", "✨ Create New Publisher"),
            createElement("p", "", "Set up a new publisher configuration with all the necessary details and customizations")
        );
    } else {
        hero.append(
            createElement("h1", "", "✏️ Edit Publisher"),
            createElement("p", "", `Update the configuration for ${publisherName || "this publisher"}`)
        );
    }

    return hero;
}
