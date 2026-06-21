import { create } from 'zustand';

export interface LogEntry {
    prefix?: string;
    text: string;
}

interface State {
    inventory: Set<string>;
    log: LogEntry[];
    hoveredItemId: string | null;
}

interface Action {
    pickUpItem: (itemId: string) => void;
    addLogEntry: (entry: LogEntry) => void;
    setHoveredItem: (itemId: string | null) => void;
}

export const useGameStore = create<State & Action>()((set) => ({
    inventory: new Set<string>(),
    log: [],
    hoveredItemId: null,
    pickUpItem: (itemId) =>
        set((state) => ({ inventory: new Set(state.inventory).add(itemId) })),
    addLogEntry: (entry) =>
        set((state) => ({ log: [...state.log, entry] })),
    setHoveredItem: (itemId) => set({ hoveredItemId: itemId }),
}));
