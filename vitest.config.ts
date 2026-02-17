import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "happy-dom",
        setupFiles: [],
        include: ["public/src/**/*.{test,spec}.{js,ts}", "server/src/**/*.{test,spec}.{js,ts}"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
        },
    },
});
