import { create } from 'zustand';
import { locations } from '@assets/locations/locations';

export interface LogEntry {
    id: number;
    prefix?: string;
    text: string;
}

function initLocationItems(): Record<string, Set<string>> {
    return Object.fromEntries(
        Object.entries(locations).map(([id, loc]) => [id, new Set(loc.items.map((item) => item.id))]),
    );
}

interface State {
    currentLocationId: string;
    inventory: Set<string>;
    locationItems: Record<string, Set<string>>;
    log: LogEntry[];
    hoveredItemId: string | null;
    flags: Record<string, unknown>;
}

interface Action {
    navigateTo: (locationId: string) => void;
    pickUpItem: (itemId: string) => void;
    removeItemFromLocation: (locationId: string, itemId: string) => void;
    addLogEntry: (entry: Omit<LogEntry, 'id'>) => void;
    setHoveredItem: (itemId: string | null) => void;
    setFlag: (key: string, value: unknown) => void;
}

export const useGameStore = create<State & Action>()((set) => ({
    currentLocationId: 'loc_behind_hlavka_pub',
    inventory: new Set<string>(),
    locationItems: initLocationItems(),
    log: [],
    hoveredItemId: null,
    flags: {},
    navigateTo: (locationId) => set({ currentLocationId: locationId }),
    pickUpItem: (itemId) =>
        set((state) => {
            const next = new Set(state.locationItems[state.currentLocationId]);
            next.delete(itemId);
            return {
                inventory: new Set(state.inventory).add(itemId),
                flags: { ...state.flags, [`item_taken:${itemId}`]: true },
                locationItems: { ...state.locationItems, [state.currentLocationId]: next },
            };
        }),
    removeItemFromLocation: (locationId, itemId) =>
        set((state) => {
            const next = new Set(state.locationItems[locationId]);
            next.delete(itemId);
            return { locationItems: { ...state.locationItems, [locationId]: next } };
        }),
    addLogEntry: (entry) =>
        set((state) => ({
            log: [...state.log, { ...entry, id: state.log.length + 1 }],
        })),
    setHoveredItem: (itemId) => set({ hoveredItemId: itemId }),
    setFlag: (key, value) =>
        set((state) => ({ flags: { ...state.flags, [key]: value } })),
}));
