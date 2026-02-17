import { createElement } from "../../utils/dom.js";
import { goToPage } from "../../handlers/handleFetchPublishers.js";

interface PaginationState {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export function renderPagination(pagination: PaginationState): HTMLElement {
    const { currentPage, totalPages, totalItems, pageSize } = pagination;

    const container = createElement("div", "pagination-container");

    // Don't render pagination if there's only one page or no items
    if (totalPages <= 1) {
        return container;
    }

    // Page info
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    const pageInfo = createElement("span", "pagination-info",
        `Showing ${startItem}-${endItem} of ${totalItems}`);
    container.append(pageInfo);

    // Pagination controls
    const controls = createElement("div", "pagination-controls");

    // Previous button
    const prevBtn = createElement("button", "pagination-btn", "← Prev") as HTMLButtonElement;
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => goToPage(currentPage - 1);
    controls.append(prevBtn);

    // Page numbers
    const pageNumbers = createElement("div", "pagination-pages");
    const pages = getVisiblePages(currentPage, totalPages);

    pages.forEach((page) => {
        if (page === "...") {
            const ellipsis = createElement("span", "pagination-ellipsis", "...");
            pageNumbers.append(ellipsis);
        } else {
            const pageNum = page as number;
            const pageBtn = createElement("button",
                `pagination-page${pageNum === currentPage ? " active" : ""}`,
                String(pageNum)) as HTMLButtonElement;
            pageBtn.onclick = () => goToPage(pageNum);
            pageNumbers.append(pageBtn);
        }
    });

    controls.append(pageNumbers);

    // Next button
    const nextBtn = createElement("button", "pagination-btn", "Next →") as HTMLButtonElement;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => goToPage(currentPage + 1);
    controls.append(nextBtn);

    container.append(controls);

    return container;
}

/**
 * Returns array of visible page numbers with ellipsis
 * Examples:
 * - [1, 2, 3, 4, 5] for 5 pages
 * - [1, 2, 3, '...', 10] when on page 1 of 10
 * - [1, '...', 4, 5, 6, '...', 10] when on page 5 of 10
 * - [1, '...', 8, 9, 10] when on page 10 of 10
 */
function getVisiblePages(current: number, total: number): (number | "...")[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [];

    // Always show first page
    pages.push(1);

    if (current <= 3) {
        // Near start: show 1, 2, 3, 4, ..., last
        pages.push(2, 3, 4, "...", total);
    } else if (current >= total - 2) {
        // Near end: show 1, ..., last-3, last-2, last-1, last
        pages.push("...", total - 3, total - 2, total - 1, total);
    } else {
        // Middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push("...", current - 1, current, current + 1, "...", total);
    }

    return pages;
}
