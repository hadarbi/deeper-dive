
export enum RouteKey {
    PUBLISHERS = "publishers",
    PUBLISHER_PAGE = "publisher-page"
}

export type Route = `${RouteKey}`;

let currentRoute: Route = RouteKey.PUBLISHERS;
let params: Record<string, string> = {};

type RouteListener = () => void;
const listeners: RouteListener[] = [];

export function navigate(route: Route, routeParams: Record<string, string> = {}) {
    currentRoute = route;
    params = routeParams;
    listeners.forEach(fn => fn());
}

export function useRoute() {
    return { route: currentRoute, params };
}

export function subscribeToRoute(fn: RouteListener) {
    listeners.push(fn);
}