import { create } from 'zustand';
import { locations as defaultLocations } from '@assets/locations/locations';
import { interactions as defaultInteractions } from '@assets/interactions/interactions';
import type { Location, Item } from '@type/Location';
import type { Interaction } from '@type/Interaction';
import type { Effect } from '@type/Effect';
import type { HoveredInteractable } from '@type/HoveredInteractable';
import { applyEffectToState } from './applyEffect';

export interface LogEntry {
    id: number;
    prefix?: string;
    text: string;
}

export interface GameDefinition {
    startLocationId: string;
    locations: Location[];
    interactions: Interaction[];
}

function buildItems(locations: Record<string, Location>): Record<string, Item> {
    const seen = new Set<string>();
    return Object.fromEntries(
        Object.values(locations).flatMap((l) =>
            l.items.map((i) => {
                if (seen.has(i.id)) console.warn(`Duplicate item id "${i.id}" across locations`);
                seen.add(i.id);
                return [i.id, i];
            }),
        ),
    );
}

function buildLocationItems(locations: Record<string, Location>): Record<string, Set<string>> {
    return Object.fromEntries(
        Object.entries(locations).map(([id, loc]) => [id, new Set(loc.items.map((i) => i.id))]),
    );
}

function toLocationsRecord(list: Location[]): Record<string, Location> {
    return Object.fromEntries(list.map((l) => [l.id, l]));
}

export interface GameState {
    locations: Record<string, Location>;
    interactions: Interaction[];
    items: Record<string, Item>;
    currentLocationId: string;
    inventory: Set<string>;
    locationItems: Record<string, Set<string>>;
    log: LogEntry[];
    hoveredInteractable: HoveredInteractable | null;
    flags: Record<string, unknown>;
}

interface Action {
    initGame: (definition: GameDefinition) => void;
    navigateTo: (locationId: string) => void;
    pickUpItem: (itemId: string) => void;
    addLogEntry: (entry: Omit<LogEntry, 'id'>) => void;
    setHoveredInteractable: (value: HoveredInteractable | null) => void;
    setFlag: (key: string, value: unknown) => void;
    applyEffect: (effect: Effect) => void;
}

export const useGameStore = create<GameState & Action>()((set) => ({
    locations: defaultLocations,
    interactions: defaultInteractions,
    items: buildItems(defaultLocations),
    currentLocationId: 'loc_behind_hlavka_pub',
    inventory: new Set<string>(),
    locationItems: buildLocationItems(defaultLocations),
    log: [],
    hoveredInteractable: null,
    flags: {},
    initGame: ({ startLocationId, locations, interactions }) => {
        const locs = toLocationsRecord(locations);
        set({
            locations: locs,
            interactions,
            items: buildItems(locs),
            currentLocationId: startLocationId,
            inventory: new Set<string>(),
            locationItems: buildLocationItems(locs),
            log: [],
            hoveredInteractable: null,
            flags: {},
        });
    },
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
