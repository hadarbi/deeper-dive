import { getState } from "../state/store.js";
import { renderPublishersListHeader } from "../ui/publisherListComponents/renderPublishersListHeader.js";
import { renderLoadingState, renderErrorState, renderEmptyState, renderPublishersGrid } from "../ui/publisherListComponents/publishersListContent.js";
import { renderPagination } from "../ui/publisherListComponents/renderPagination.js";

export async function renderPublishersListPage(root: HTMLElement) {
    const { publishers, loading, error, search, pagination } = getState();
    const { header } = renderPublishersListHeader(search, pagination.totalItems, loading, error);
    root.append(header);
    if (loading) {
        root.append(renderLoadingState());
        return;
    }

    if (error) {
        root.append(renderErrorState(error));
        return;
    }

    if (publishers.length === 0) {
        root.append(renderEmptyState(search));
        return;
    }

    root.append(renderPublishersGrid(publishers));
    root.append(renderPagination(pagination));
}
