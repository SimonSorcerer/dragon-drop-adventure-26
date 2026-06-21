import { create } from 'zustand';

export interface LogEntry {
    id: number;
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
    addLogEntry: (entry: Omit<LogEntry, 'id'>) => void;
    setHoveredItem: (itemId: string | null) => void;
}

export const useGameStore = create<State & Action>()((set) => ({
    inventory: new Set<string>(),
    log: [],
    hoveredItemId: null,
    pickUpItem: (itemId) =>
        set((state) => ({ inventory: new Set(state.inventory).add(itemId) })),
    addLogEntry: (entry) =>
        set((state) => ({
            log: [...state.log, { ...entry, id: state.log.length + 1 }],
        })),
    setHoveredItem: (itemId) => set({ hoveredItemId: itemId }),
}));
