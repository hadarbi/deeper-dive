import { describe, it, expect, beforeEach, vi } from "vitest";
import { Publisher } from "../types/publisher.js";

// We need to reset modules before each test to get a fresh state
beforeEach(() => {
    vi.resetModules();
});

describe("store", () => {
    describe("getState", () => {
        it("should return the initial state", async () => {
            const { getState } = await import("./store.js");
            const state = getState();

            expect(state).toEqual({
                publishers: [],
                loading: false,
                error: null,
                search: "",
                filterStatus: "all",
                isInCreateOrEditMode: false,
                pagination: {
                    currentPage: 1,
                    pageSize: 9,
                    totalItems: 0,
                    totalPages: 0,
                },
                theme: "light",
            });
        });

        it("should return the same state object reference", async () => {
            const { getState } = await import("./store.js");
            const state1 = getState();
            const state2 = getState();

            expect(state1).toBe(state2);
        });
    });

    describe("setState", () => {
        it("should update the state with partial values", async () => {
            const { getState, setState } = await import("./store.js");

            setState({ loading: true });

            expect(getState().loading).toBe(true);
            expect(getState().publishers).toEqual([]);
        });

        it("should update multiple state properties at once", async () => {
            const { getState, setState } = await import("./store.js");

            setState({
                loading: true,
                search: "test query",
                filterStatus: "active",
            });

            expect(getState().loading).toBe(true);
            expect(getState().search).toBe("test query");
            expect(getState().filterStatus).toBe("active");
        });

        it("should update publishers array", async () => {
            const { getState, setState } = await import("./store.js");
            const mockPublishers = [
                { id: "1", name: "Publisher 1", status: "active" as const },
                { id: "2", name: "Publisher 2", status: "inactive" as const },
            ];

            setState({ publishers: mockPublishers as unknown as Publisher[] });

            expect(getState().publishers).toEqual(mockPublishers);
        });

        it("should set error state", async () => {
            const { getState, setState } = await import("./store.js");

            setState({ error: "Something went wrong" });

            expect(getState().error).toBe("Something went wrong");
        });

        it("should toggle isInCreateOrEditMode", async () => {
            const { getState, setState } = await import("./store.js");

            expect(getState().isInCreateOrEditMode).toBe(false);

            setState({ isInCreateOrEditMode: true });
            expect(getState().isInCreateOrEditMode).toBe(true);

            setState({ isInCreateOrEditMode: false });
            expect(getState().isInCreateOrEditMode).toBe(false);
        });
    });

    describe("subscribe", () => {
        it("should add a listener that gets called on state change", async () => {
            const { setState, subscribe } = await import("./store.js");
            const listener = vi.fn();

            subscribe(listener);
            setState({ loading: true });

            expect(listener).toHaveBeenCalledTimes(1);
        });

        it("should call all subscribed listeners on state change", async () => {
            const { setState, subscribe } = await import("./store.js");
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            const listener3 = vi.fn();

            subscribe(listener1);
            subscribe(listener2);
            subscribe(listener3);

            setState({ search: "new search" });

            expect(listener1).toHaveBeenCalledTimes(1);
            expect(listener2).toHaveBeenCalledTimes(1);
            expect(listener3).toHaveBeenCalledTimes(1);
        });

        it("should not call listeners when state does not change", async () => {
            const { setState, subscribe } = await import("./store.js");
            const listener = vi.fn();

            subscribe(listener);

            // Set to same values as initial state
            setState({
                publishers: [],
                loading: false,
                error: null,
            });

            expect(listener).not.toHaveBeenCalled();
        });

        it("should call listeners multiple times for multiple state changes", async () => {
            const { setState, subscribe } = await import("./store.js");
            const listener = vi.fn();

            subscribe(listener);

            setState({ loading: true });
            setState({ loading: false });
            setState({ search: "query" });

            expect(listener).toHaveBeenCalledTimes(3);
        });
    });

    describe("filterStatus", () => {
        it("should accept \"all\" as filter status", async () => {
            const { getState, setState } = await import("./store.js");

            setState({ filterStatus: "all" });
            expect(getState().filterStatus).toBe("all");
        });

        it("should accept \"active\" as filter status", async () => {
            const { getState, setState } = await import("./store.js");

            setState({ filterStatus: "active" });
            expect(getState().filterStatus).toBe("active");
        });

        it("should accept \"inactive\" as filter status", async () => {
            const { getState, setState } = await import("./store.js");

            setState({ filterStatus: "inactive" });
            expect(getState().filterStatus).toBe("inactive");
        });
    });
});
