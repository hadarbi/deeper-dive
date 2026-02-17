import { describe, it, expect, beforeEach, vi } from "vitest";

// We need to reset modules before each test to get fresh router state
beforeEach(() => {
    vi.resetModules();
});

describe("router", () => {
    describe("RouteKey enum", () => {
        it("should have PUBLISHERS route key", async () => {
            const { RouteKey } = await import("./router.js");
            expect(RouteKey.PUBLISHERS).toBe("publishers");
        });

        it("should have PUBLISHER_PAGE route key", async () => {
            const { RouteKey } = await import("./router.js");
            expect(RouteKey.PUBLISHER_PAGE).toBe("publisher-page");
        });
    });

    describe("useRoute", () => {
        it("should return initial route as PUBLISHERS", async () => {
            const { useRoute, RouteKey } = await import("./router.js");
            const { route, params } = useRoute();

            expect(route).toBe(RouteKey.PUBLISHERS);
            expect(params).toEqual({});
        });

        it("should return current route and params", async () => {
            const { useRoute, navigate, RouteKey } = await import("./router.js");

            navigate(RouteKey.PUBLISHER_PAGE, { id: "123" });

            const { route, params } = useRoute();
            expect(route).toBe(RouteKey.PUBLISHER_PAGE);
            expect(params).toEqual({ id: "123" });
        });
    });

    describe("navigate", () => {
        it("should change the current route", async () => {
            const { useRoute, navigate, RouteKey } = await import("./router.js");

            navigate(RouteKey.PUBLISHER_PAGE);

            expect(useRoute().route).toBe(RouteKey.PUBLISHER_PAGE);
        });

        it("should update route params", async () => {
            const { useRoute, navigate, RouteKey } = await import("./router.js");

            navigate(RouteKey.PUBLISHER_PAGE, { id: "abc-123", mode: "edit" });

            const { params } = useRoute();
            expect(params).toEqual({ id: "abc-123", mode: "edit" });
        });

        it("should default params to empty object when not provided", async () => {
            const { useRoute, navigate, RouteKey } = await import("./router.js");

            navigate(RouteKey.PUBLISHERS);

            expect(useRoute().params).toEqual({});
        });

        it("should replace previous params entirely", async () => {
            const { useRoute, navigate, RouteKey } = await import("./router.js");

            navigate(RouteKey.PUBLISHER_PAGE, { id: "123", extra: "value" });
            navigate(RouteKey.PUBLISHER_PAGE, { id: "456" });

            const { params } = useRoute();
            expect(params).toEqual({ id: "456" });
            expect(params).not.toHaveProperty("extra");
        });

        it("should notify all listeners when navigating", async () => {
            const { navigate, subscribeToRoute, RouteKey } = await import("./router.js");
            const listener = vi.fn();

            subscribeToRoute(listener);
            navigate(RouteKey.PUBLISHER_PAGE);

            expect(listener).toHaveBeenCalledTimes(1);
        });
    });

    describe("subscribeToRoute", () => {
        it("should add a listener that gets called on navigation", async () => {
            const { navigate, subscribeToRoute, RouteKey } = await import("./router.js");
            const listener = vi.fn();

            subscribeToRoute(listener);
            navigate(RouteKey.PUBLISHERS);

            expect(listener).toHaveBeenCalledTimes(1);
        });

        it("should call all subscribed listeners on navigation", async () => {
            const { navigate, subscribeToRoute, RouteKey } = await import("./router.js");
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            const listener3 = vi.fn();

            subscribeToRoute(listener1);
            subscribeToRoute(listener2);
            subscribeToRoute(listener3);

            navigate(RouteKey.PUBLISHER_PAGE);

            expect(listener1).toHaveBeenCalledTimes(1);
            expect(listener2).toHaveBeenCalledTimes(1);
            expect(listener3).toHaveBeenCalledTimes(1);
        });

        it("should call listeners multiple times for multiple navigations", async () => {
            const { navigate, subscribeToRoute, RouteKey } = await import("./router.js");
            const listener = vi.fn();

            subscribeToRoute(listener);

            navigate(RouteKey.PUBLISHER_PAGE);
            navigate(RouteKey.PUBLISHERS);
            navigate(RouteKey.PUBLISHER_PAGE, { id: "123" });

            expect(listener).toHaveBeenCalledTimes(3);
        });

        it("should still call listeners when navigating to the same route", async () => {
            const { navigate, subscribeToRoute, RouteKey } = await import("./router.js");
            const listener = vi.fn();

            subscribeToRoute(listener);

            navigate(RouteKey.PUBLISHERS);
            navigate(RouteKey.PUBLISHERS);

            expect(listener).toHaveBeenCalledTimes(2);
        });
    });

    describe("navigation scenarios", () => {
        it("should handle navigation from publishers list to publisher page", async () => {
            const { useRoute, navigate, RouteKey } = await import("./router.js");

            // Start at publishers list
            expect(useRoute().route).toBe(RouteKey.PUBLISHERS);

            // Navigate to specific publisher
            navigate(RouteKey.PUBLISHER_PAGE, { id: "publisher-123" });

            const { route, params } = useRoute();
            expect(route).toBe(RouteKey.PUBLISHER_PAGE);
            expect(params.id).toBe("publisher-123");
        });

        it("should handle navigation back to publishers list", async () => {
            const { useRoute, navigate, RouteKey } = await import("./router.js");

            // Navigate to publisher page first
            navigate(RouteKey.PUBLISHER_PAGE, { id: "publisher-123" });

            // Navigate back to publishers list
            navigate(RouteKey.PUBLISHERS);

            const { route, params } = useRoute();
            expect(route).toBe(RouteKey.PUBLISHERS);
            expect(params).toEqual({});
        });

        it("should handle edit mode parameter", async () => {
            const { useRoute, navigate, RouteKey } = await import("./router.js");

            navigate(RouteKey.PUBLISHER_PAGE, { id: "publisher-123", mode: "edit" });

            const { params } = useRoute();
            expect(params.id).toBe("publisher-123");
            expect(params.mode).toBe("edit");
        });

        it("should handle create mode parameter", async () => {
            const { useRoute, navigate, RouteKey } = await import("./router.js");

            navigate(RouteKey.PUBLISHER_PAGE, { mode: "create" });

            const { params } = useRoute();
            expect(params.mode).toBe("create");
        });
    });
});
