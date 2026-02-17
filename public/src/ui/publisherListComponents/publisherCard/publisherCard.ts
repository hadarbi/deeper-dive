import { Publisher } from "../../../types/publisher.js";
import { navigate, RouteKey } from "../../../state/router.js";
import { createElement } from "../../../utils/dom.js";
import { renderCardAvatar, renderCardInfo } from "./cardContent.js";
import { renderCardActions } from "./cardActions.js";

export function renderPublisherCard(publisher: Publisher) {
    const card = createElement("div", "publisher-card card");

    const avatar = renderCardAvatar(publisher.aliasName);
    const info = renderCardInfo(publisher);
    const actions = renderCardActions(publisher.publisherId, publisher.aliasName);

    // Make entire card clickable and keyboard accessible
    card.setAttribute("role", "button");
    card.onclick = () => {
        navigate(RouteKey.PUBLISHER_PAGE, { publisherId: publisher.publisherId });
    };
    card.append(avatar, info, actions);
    return card;
}
