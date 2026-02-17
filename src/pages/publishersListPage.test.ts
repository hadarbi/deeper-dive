import { describe, it, expect, beforeEach, vi } from "vitest";

// Create mock functions
const mockGetState = vi.fn();
const mockRenderPublishersListHeader = vi.fn();
const mockRenderLoadingState = vi.fn();
const mockRenderErrorState = vi.fn();
const mockRenderEmptyState = vi.fn();
const mockRenderPublishersGrid = vi.fn();

// Mock all dependencies
vi.mock("../state/store.js", () => ({
    getState: mockGetState,
}));

vi.mock("../ui/publisherListComponents/renderPublishersListHeader.js", () => ({
    renderPublishersListHeader: mockRenderPublishersListHeader,
}));

vi.mock("../ui/publisherListComponents/publishersListContent.js", () => ({
    renderLoadingState: mockRenderLoadingState,
    renderErrorState: mockRenderErrorState,
    renderEmptyState: mockRenderEmptyState,
    renderPublishersGrid: mockRenderPublishersGrid,
}));

describe("publishersListPage", () => {
    let root: HTMLElement;

    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();

        // Set up DOM
        root = document.createElement("div");
        root.id = "app";

        // Default mock return values
        mockRenderPublishersListHeader.mockReturnValue({
            header: document.createElement("header"),
        });
        mockRenderLoadingState.mockReturnValue(document.createElement("div"));
        mockRenderErrorState.mockReturnValue(document.createElement("div"));
        mockRenderEmptyState.mockReturnValue(document.createElement("div"));
        mockRenderPublishersGrid.mockReturnValue(document.createElement("div"));
    });

    describe("renderPublishersListPage", () => {
        it("should always render the header", async () => {
            mockGetState.mockReturnValue({
                publishers: [],
                loading: false,
                error: null,
                search: "",
                pagination: { totalItems: 0 },
            });
            const { renderPublishersListPage } = await import("./publishersListPage.js");

            await renderPublishersListPage(root);

            expect(mockRenderPublishersListHeader).toHaveBeenCalled();
            expect(root.querySelector("header")).toBeTruthy();
        });

        it("should pass correct params to header", async () => {
            const mockPublishers = [{ id: "1" }, { id: "2" }];
            mockGetState.mockReturnValue({
                publishers: mockPublishers,
                loading: false,
                error: null,
                search: "test search",
                pagination: { totalItems: 2 },
            });
            const { renderPublishersListPage } = await import("./publishersListPage.js");

            await renderPublishersListPage(root);

            expect(mockRenderPublishersListHeader).toHaveBeenCalledWith(
                "test search",
                2, // publishers.length
                false, // loading
                null // error
            );
        });

        describe("loading state", () => {
            beforeEach(() => {
                mockGetState.mockReturnValue({
                    publishers: [],
                    loading: true,
                    error: null,
                    search: "",
                    pagination: { totalItems: 0 },
                });
            });

            it("should render loading state when loading is true", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderLoadingState).toHaveBeenCalled();
            });

            it("should not render error state when loading", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderErrorState).not.toHaveBeenCalled();
            });

            it("should not render empty state when loading", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderEmptyState).not.toHaveBeenCalled();
            });

            it("should not render publishers grid when loading", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderPublishersGrid).not.toHaveBeenCalled();
            });
        });

        describe("error state", () => {
            beforeEach(() => {
                mockGetState.mockReturnValue({
                    publishers: [],
                    loading: false,
                    error: "Something went wrong",
                    search: "",
                    pagination: { totalItems: 0 },
                });
            });

            it("should render error state when error exists", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderErrorState).toHaveBeenCalledWith("Something went wrong");
            });

            it("should not render loading state when error exists", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderLoadingState).not.toHaveBeenCalled();
            });

            it("should not render empty state when error exists", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderEmptyState).not.toHaveBeenCalled();
            });

            it("should not render publishers grid when error exists", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderPublishersGrid).not.toHaveBeenCalled();
            });
        });

        describe("empty state", () => {
            beforeEach(() => {
                mockGetState.mockReturnValue({
                    publishers: [],
                    loading: false,
                    error: null,
                    search: "",
                    pagination: { totalItems: 0 },
                });
            });

            it("should render empty state when publishers array is empty", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderEmptyState).toHaveBeenCalledWith("");
            });

            it("should pass search query to empty state", async () => {
                mockGetState.mockReturnValue({
                    publishers: [],
                    loading: false,
                    error: null,
                    search: "no results query",
                    pagination: { totalItems: 0 },
                });
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderEmptyState).toHaveBeenCalledWith("no results query");
            });

            it("should not render loading state when empty", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderLoadingState).not.toHaveBeenCalled();
            });

            it("should not render publishers grid when empty", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderPublishersGrid).not.toHaveBeenCalled();
            });
        });

        describe("publishers grid", () => {
            const mockPublishers = [
                { id: "1", name: "Publisher 1", status: "active" },
                { id: "2", name: "Publisher 2", status: "inactive" },
                { id: "3", name: "Publisher 3", status: "active" },
            ];

            beforeEach(() => {
                mockGetState.mockReturnValue({
                    publishers: mockPublishers,
                    loading: false,
                    error: null,
                    search: "",
                    pagination: { totalItems: 3 },
                });
            });

            it("should render publishers grid when publishers exist", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderPublishersGrid).toHaveBeenCalledWith(mockPublishers);
            });

            it("should not render loading state when publishers exist", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderLoadingState).not.toHaveBeenCalled();
            });

            it("should not render error state when publishers exist", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderErrorState).not.toHaveBeenCalled();
            });

            it("should not render empty state when publishers exist", async () => {
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderEmptyState).not.toHaveBeenCalled();
            });
        });

        describe("state priority", () => {
            it("should prioritize loading over error", async () => {
                mockGetState.mockReturnValue({
                    publishers: [],
                    loading: true,
                    error: "Error message",
                    search: "",
                    pagination: { totalItems: 0 },
                });
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderLoadingState).toHaveBeenCalled();
                expect(mockRenderErrorState).not.toHaveBeenCalled();
            });

            it("should prioritize loading over publishers", async () => {
                mockGetState.mockReturnValue({
                    publishers: [{ id: "1" }],
                    loading: true,
                    error: null,
                    search: "",
                    pagination: { totalItems: 1 },
                });
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderLoadingState).toHaveBeenCalled();
                expect(mockRenderPublishersGrid).not.toHaveBeenCalled();
            });

            it("should prioritize error over empty state", async () => {
                mockGetState.mockReturnValue({
                    publishers: [],
                    loading: false,
                    error: "Error message",
                    search: "",
                    pagination: { totalItems: 0 },
                });
                const { renderPublishersListPage } = await import("./publishersListPage.js");

                await renderPublishersListPage(root);

                expect(mockRenderErrorState).toHaveBeenCalled();
                expect(mockRenderEmptyState).not.toHaveBeenCalled();
            });
        });
    });
});
