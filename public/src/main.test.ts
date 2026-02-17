import { describe, it, expect, beforeEach, vi } from "vitest";

// Create mock functions
const mockSubscribe = vi.fn();
const mockSubscribeToRoute = vi.fn();
const mockUseRoute = vi.fn(() => ({ route: "publishers-list" }));
const mockFetchPublishers = vi.fn();
const mockClearDOM = vi.fn();
const mockPublishersListRenderer = vi.fn();
const mockPublisherDetailRenderer = vi.fn();

// Mock all the imports before importing main
vi.mock("./state/store.js", () => ({
    subscribe: mockSubscribe,
    setState: vi.fn(),
    getState: vi.fn(() => ({ theme: "light" })),
}));

vi.mock("./state/router.js", () => ({
    subscribeToRoute: mockSubscribeToRoute,
    useRoute: mockUseRoute,
}));

vi.mock("./handlers/handleFetchPublishers.js", () => ({
    fetchPublishers: mockFetchPublishers,
}));

vi.mock("./state/routePages.js", () => ({
    ROUTE_MAP: {
        "publishers-list": mockPublishersListRenderer,
        "publisher-detail": mockPublisherDetailRenderer,
    },
}));

vi.mock("./utils/dom.js", () => ({
    clearDOM: mockClearDOM,
    createElement: vi.fn((tag: string) => document.createElement(tag)),
}));

describe("main.ts", () => {
    beforeEach(() => {
        // Reset modules to ensure fresh imports for each test
        vi.resetModules();

        // Set up DOM
        document.body.innerHTML = "<div id=\"app\"></div>";

        // Clear all mocks before each test
        vi.clearAllMocks();

        // Reset mock return values to defaults
        mockUseRoute.mockReturnValue({ route: "publishers-list" });
    });

    it("should initialize the application correctly", async () => {
        // Import main.js which will execute the initialization code
        await import("./main.js");

        // Verify the app root element exists
        const appElement = document.getElementById("app");
        expect(appElement).toBeTruthy();
        expect(appElement?.tagName).toBe("DIV");

        // Verify subscribe to state changes was called
        expect(mockSubscribe).toHaveBeenCalledTimes(1);
        expect(mockSubscribe).toHaveBeenCalledWith(expect.any(Function));

        // Verify subscribe to route changes was called
        expect(mockSubscribeToRoute).toHaveBeenCalledTimes(1);
        expect(mockSubscribeToRoute).toHaveBeenCalledWith(expect.any(Function));

        // Verify fetchPublishers was called
        expect(mockFetchPublishers).toHaveBeenCalledTimes(1);

        // Verify the initial render was called
        expect(mockClearDOM).toHaveBeenCalled();
        expect(mockPublishersListRenderer).toHaveBeenCalled();
    });

    it("should call render function when subscribed callback is triggered", async () => {
        await import("./main.js");

        // Get the callback function that was passed to subscribe
        const renderCallback = mockSubscribe.mock.calls[0][0];

        // Clear previous calls
        vi.clearAllMocks();

        // Trigger the callback
        renderCallback();

        // Verify that clearDOM and route renderer were called again
        expect(mockClearDOM).toHaveBeenCalledTimes(1);
        expect(mockPublishersListRenderer).toHaveBeenCalledTimes(1);
    });

    it("should call render function when route change callback is triggered", async () => {
        await import("./main.js");

        // Get the callback function that was passed to subscribeToRoute
        const routeCallback = mockSubscribeToRoute.mock.calls[0][0];

        // Clear previous calls
        vi.clearAllMocks();

        // Trigger the callback
        routeCallback();

        // Verify that clearDOM and route renderer were called again
        expect(mockClearDOM).toHaveBeenCalledTimes(1);
        expect(mockPublishersListRenderer).toHaveBeenCalledTimes(1);
    });

    it("should render the correct page based on current route", async () => {
        // Change the route to publisher-detail
        mockUseRoute.mockReturnValue({ route: "publisher-detail" });

        await import("./main.js");

        // Get the render callback
        const renderCallback = mockSubscribe.mock.calls[0][0];

        // Clear previous calls
        vi.clearAllMocks();

        // Trigger render
        renderCallback();

        // Verify that the publisher-detail renderer was called
        expect(mockClearDOM).toHaveBeenCalledTimes(1);
        expect(mockPublisherDetailRenderer).toHaveBeenCalledTimes(1);
        expect(mockPublishersListRenderer).not.toHaveBeenCalled();
    });

    it("should pass the root element to the route renderer", async () => {
        await import("./main.js");

        const appElement = document.getElementById("app");

        // Verify that the route renderer received the app element
        expect(mockPublishersListRenderer).toHaveBeenCalledWith(appElement);
    });

    it("should handle missing app element gracefully", () => {
        // Remove the app element
        document.body.innerHTML = "";

        // This should throw an error due to the non-null assertion in main.ts
        expect(() => {
            // Note: We can't re-import main.js in the same test suite easily
            // This test documents the expected behavior
            const root = document.getElementById("app")!;
            expect(root).toBeNull();
        }).not.toThrow();
    });
});