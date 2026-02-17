import { Publisher } from "../types/publisher.js";

export type Theme = "light" | "dark";

type PaginationState = {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
};

type State = {
    publishers: Publisher[];
    loading: boolean;
    error: string | null;
    search: string;
    filterStatus: "all" | "active" | "inactive";
    isInCreateOrEditMode: boolean;
    pagination: PaginationState;
    theme: Theme;
};

const state: State = {
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
    theme: "light", // Will be initialized from localStorage by themeService
};

type Listener = () => void;
const listeners: Listener[] = [];

export function getState() {
    return state;
}

export function setState(partial: Partial<State>) {
    const prevState = { ...state };
    Object.assign(state, partial);

    const hasChange = JSON.stringify(prevState) !== JSON.stringify(state);
    if (hasChange) {
        listeners.forEach(fn => fn());
    }
}

export function subscribe(fn: Listener) {
    listeners.push(fn);
}
