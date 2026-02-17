import { setState, getState } from "../state/store.js";
import { publisherService } from "../services/publisherService.js";

export const fetchPublishers = async (search?: string, page?: number) => {
    try {
        setState({ loading: true, error: null });
        const { filterStatus, pagination } = getState();
        const isActive = filterStatus === "all" ? undefined : filterStatus === "active";
        const currentPage = page ?? pagination.currentPage;

        const response = await publisherService.getAll(search, isActive, currentPage, pagination.pageSize);

        setState({
            publishers: response.data,
            loading: false,
            error: null,
            pagination: response.pagination,
        });
    } catch (err) {
        setState({ loading: false, error: "Failed to load publishers" });
    }
};

export const goToPage = async (page: number) => {
    const { search } = getState();
    await fetchPublishers(search, page);
};
