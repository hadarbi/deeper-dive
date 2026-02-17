import { buildApiUrl } from "./urlBuilder.js";

export async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(buildApiUrl(path), {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}
