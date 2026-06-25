import { create } from 'zustand';
import { locations } from '@assets/locations/locations';
import type { Effect } from '@type/Effect';
import type { HoveredInteractable } from '@type/HoveredInteractable';
import { applyEffectToState } from './applyEffect';

export interface LogEntry {
    id: number;
    prefix?: string;
    text: string;
}

export interface GameState {
    currentLocationId: string;
    inventory: Set<string>;
    locationItems: Record<string, Set<string>>;
    log: LogEntry[];
    hoveredInteractable: HoveredInteractable | null;
    flags: Record<string, unknown>;
}

function initLocationItems(): Record<string, Set<string>> {
    return Object.fromEntries(
        Object.entries(locations).map(([id, loc]) => [id, new Set(loc.items.map((item) => item.id))]),
    );
}

interface Action {
    navigateTo: (locationId: string) => void;
    pickUpItem: (itemId: string) => void;
    addLogEntry: (entry: Omit<LogEntry, 'id'>) => void;
    setHoveredInteractable: (value: HoveredInteractable | null) => void;
    setFlag: (key: string, value: unknown) => void;
    applyEffect: (effect: Effect) => void;
}

export const useGameStore = create<GameState & Action>()((set) => ({
    currentLocationId: 'loc_behind_hlavka_pub',
    inventory: new Set<string>(),
    locationItems: initLocationItems(),
    log: [],
    hoveredInteractable: null,
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
    addLogEntry: (entry) =>
        set((state) => ({
            log: [...state.log, { ...entry, id: state.log.length + 1 }],
        })),
    setHoveredInteractable: (value) => set({ hoveredInteractable: value }),
    setFlag: (key, value) =>
        set((state) => ({ flags: { ...state.flags, [key]: value } })),
    applyEffect: (effect) => set((state) => applyEffectToState(effect, state)),
}));
