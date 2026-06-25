import { create } from 'zustand';

export interface LogEntry {
    id: number;
    prefix?: string;
    text: string;
}

interface State {
    currentLocationId: string;
    inventory: Set<string>;
    log: LogEntry[];
    hoveredItemId: string | null;
    flags: Record<string, unknown>;
}

interface Action {
    navigateTo: (locationId: string) => void;
    pickUpItem: (itemId: string) => void;
    addLogEntry: (entry: Omit<LogEntry, 'id'>) => void;
    setHoveredItem: (itemId: string | null) => void;
    setFlag: (key: string, value: unknown) => void;
}

export const useGameStore = create<State & Action>()((set) => ({
    currentLocationId: 'loc_behind_hlavka_pub',
    inventory: new Set<string>(),
    log: [],
    hoveredItemId: null,
    flags: {},
    navigateTo: (locationId) => set({ currentLocationId: locationId }),
    pickUpItem: (itemId) =>
        set((state) => ({
            inventory: new Set(state.inventory).add(itemId),
            flags: { ...state.flags, [`item_taken:${itemId}`]: true },
        })),
    addLogEntry: (entry) =>
        set((state) => ({
            log: [...state.log, { ...entry, id: state.log.length + 1 }],
        })),
    setHoveredItem: (itemId) => set({ hoveredItemId: itemId }),
    setFlag: (key, value) =>
        set((state) => ({ flags: { ...state.flags, [key]: value } })),
}));
