export function createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    text?: unknown
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);

    if (typeof className === "string" && className.length > 0) {
        element.className = className;
    }

    if (text !== undefined && text !== null) {
        element.textContent = String(text);
    }

    return element;
}

export function clearDOM(element: HTMLElement): void {
    element.innerHTML = "";
}
