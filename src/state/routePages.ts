import { Route, RouteKey } from "./router.js";
import { renderPublishersListPage } from "../pages/publishersListPage.js";
import { renderPublisherPage } from "../pages/publisherPage.js";

export type RouteRenderer = (root: HTMLElement) => void;
export const ROUTE_MAP: Record<Route, RouteRenderer> = {
    [RouteKey.PUBLISHERS]: renderPublishersListPage,
    [RouteKey.PUBLISHER_PAGE]: renderPublisherPage,
};