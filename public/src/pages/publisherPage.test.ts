import { describe, it, expect, beforeEach, vi } from "vitest";

// Create mock functions
const mockGetState = vi.fn();
const mockUseRoute = vi.fn();
const mockGetById = vi.fn();
const mockRenderPublisherForm = vi.fn();
const mockRenderPublisherView = vi.fn();
const mockRenderBreadcrumbs = vi.fn();

// Mock all dependencies
vi.mock("../state/store.js", () => ({
    getState: mockGetState,
}));

vi.mock("../state/router.js", () => ({
    useRoute: mockUseRoute,
}));

vi.mock("../services/publisherService.js", () => ({
    publisherService: {
        getById: mockGetById,
    },
}));

vi.mock("../ui/publisherForm/publisherForm.js", () => ({
    renderPublisherForm: mockRenderPublisherForm,
}));

vi.mock("../ui/publisherView/publisherView.js", () => ({
    renderPublisherView: mockRenderPublisherView,
}));

vi.mock("../ui/breadcrumbs/breadcrumbs.js", () => ({
    renderBreadcrumbs: mockRenderBreadcrumbs,
}));

describe("publisherPage", () => {
    let root: HTMLElement;

    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();

        // Set up DOM
        root = document.createElement("div");
        root.id = "app";

        // Default mock return values
        mockGetState.mockReturnValue({ isInCreateOrEditMode: false });
        mockUseRoute.mockReturnValue({ params: {} });
        mockRenderBreadcrumbs.mockReturnValue(document.createElement("nav"));
        mockRenderPublisherView.mockReturnValue(document.createElement("div"));
        mockRenderPublisherForm.mockReturnValue({
            wrapper: document.createElement("form"),
            hasUnsavedChanges: vi.fn(() => false),
        });
    });

    describe("renderPublisherPage", () => {
        it("should render breadcrumbs and content to root element", async () => {
            const { renderPublisherPage } = await import("./publisherPage.js");

            await renderPublisherPage(root);

            expect(root.children.length).toBe(2);
        });

        it("should call getState to check create/edit mode", async () => {
            const { renderPublisherPage } = await import("./publisherPage.js");

            await renderPublisherPage(root);

            expect(mockGetState).toHaveBeenCalled();
        });

        it("should call useRoute to get params", async () => {
            const { renderPublisherPage } = await import("./publisherPage.js");

            await renderPublisherPage(root);

            expect(mockUseRoute).toHaveBeenCalled();
        });

        describe("when viewing existing publisher", () => {
            const mockPublisher = {
                id: "pub-123",
                name: "Test Publisher",
                status: "active",
            };

            beforeEach(() => {
                mockUseRoute.mockReturnValue({ params: { publisherId: "pub-123" } });
                mockGetById.mockResolvedValue(mockPublisher);
            });

            it("should fetch publisher by ID", async () => {
                const { renderPublisherPage } = await import("./publisherPage.js");

                await renderPublisherPage(root);

                expect(mockGetById).toHaveBeenCalledWith("pub-123");
            });

            it("should render publisher view when not in edit mode", async () => {
                mockGetState.mockReturnValue({ isInCreateOrEditMode: false });
                const { renderPublisherPage } = await import("./publisherPage.js");

                await renderPublisherPage(root);

                expect(mockRenderPublisherView).toHaveBeenCalledWith(mockPublisher);
                expect(mockRenderPublisherForm).not.toHaveBeenCalled();
            });

            it("should render publisher form when in edit mode", async () => {
                mockGetState.mockReturnValue({ isInCreateOrEditMode: true });
                const { renderPublisherPage } = await import("./publisherPage.js");

                await renderPublisherPage(root);

                expect(mockRenderPublisherForm).toHaveBeenCalledWith(mockPublisher);
                expect(mockRenderPublisherView).not.toHaveBeenCalled();
            });

            it("should pass publisher to breadcrumbs", async () => {
                const { renderPublisherPage } = await import("./publisherPage.js");

                await renderPublisherPage(root);

                expect(mockRenderBreadcrumbs).toHaveBeenCalledWith(
                    mockPublisher,
                    false, // isInNewPublisherMode
                    undefined // hasUnsavedChangesCheck (undefined in view mode)
                );
            });
        });

        describe("when creating new publisher", () => {
            beforeEach(() => {
                mockUseRoute.mockReturnValue({ params: {} }); // No publisherId
                mockGetState.mockReturnValue({ isInCreateOrEditMode: true });
            });

            it("should not fetch publisher", async () => {
                const { renderPublisherPage } = await import("./publisherPage.js");

                await renderPublisherPage(root);

                expect(mockGetById).not.toHaveBeenCalled();
            });

            it("should render publisher form with null publisher", async () => {
                const { renderPublisherPage } = await import("./publisherPage.js");

                await renderPublisherPage(root);

                expect(mockRenderPublisherForm).toHaveBeenCalledWith(null);
            });

            it("should pass isInNewPublisherMode as true to breadcrumbs", async () => {
                const hasUnsavedChanges = vi.fn(() => false);
                mockRenderPublisherForm.mockReturnValue({
                    wrapper: document.createElement("form"),
                    hasUnsavedChanges,
                });
                const { renderPublisherPage } = await import("./publisherPage.js");

                await renderPublisherPage(root);

                expect(mockRenderBreadcrumbs).toHaveBeenCalledWith(
                    null,
                    true, // isInNewPublisherMode
                    hasUnsavedChanges
                );
            });
        });

        describe("edit mode with hasUnsavedChanges", () => {
            it("should pass hasUnsavedChanges function to breadcrumbs in edit mode", async () => {
                const hasUnsavedChanges = vi.fn(() => true);
                mockRenderPublisherForm.mockReturnValue({
                    wrapper: document.createElement("form"),
                    hasUnsavedChanges,
                });
                mockGetState.mockReturnValue({ isInCreateOrEditMode: true });
                mockUseRoute.mockReturnValue({ params: { publisherId: "pub-123" } });
                mockGetById.mockResolvedValue({ id: "pub-123", name: "Test" });

                const { renderPublisherPage } = await import("./publisherPage.js");

                await renderPublisherPage(root);

                expect(mockRenderBreadcrumbs).toHaveBeenCalledWith(
                    expect.any(Object),
                    false,
                    hasUnsavedChanges
                );
            });
        });
    });
});
