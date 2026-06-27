import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Location, Item, LocationExit } from '@type/Location';
import type { Interaction } from '@type/Interaction';
import type { Effect } from '@type/Effect';

export interface EditorProject {
    id: string;
    name: string;
    startLocationId: string;
    locations: Location[];
    interactions: Interaction[];
}

const DEFAULT_PROJECT: EditorProject = {
    id: 'new_game',
    name: 'New Game',
    startLocationId: '',
    locations: [],
    interactions: [],
};

const makeLocation = (): Location => ({
    id: `loc_${Date.now()}`,
    name: 'New Location',
    description: '',
    images: {},
    items: [],
    exits: [],
});

const makeItem = (): Item => ({
    id: `item_${Date.now()}`,
    name: 'new item',
    description: '',
    interactive: true,
    canPickup: true,
});

const makeExit = (): LocationExit => ({
    direction: 'north',
    destination: '',
    description: '',
});

const makeInteraction = (): Interaction => ({
    keys: ['', ''],
    prefix: '',
    text: '',
    effects: [],
});

const DEFAULT_EFFECT: Effect = { type: 'setFlag', key: '', value: '' };

interface EditorState {
    project: EditorProject;
    selectedLocationId: string | null;
    selectedInteractionIdx: number | null;

    setProjectName(name: string): void;
    setProjectId(id: string): void;
    setStartLocation(id: string): void;

    addLocation(): void;
    updateLocation(id: string, patch: Partial<Location>): void;
    deleteLocation(id: string): void;
    selectLocation(id: string | null): void;

    addItem(locationId: string): void;
    updateItem(locationId: string, itemId: string, patch: Partial<Item>): void;
    deleteItem(locationId: string, itemId: string): void;

    addExit(locationId: string): void;
    updateExit(locationId: string, idx: number, patch: Partial<LocationExit>): void;
    deleteExit(locationId: string, idx: number): void;

    addInteraction(): void;
    updateInteraction(idx: number, patch: Partial<Interaction>): void;
    deleteInteraction(idx: number): void;
    selectInteraction(idx: number | null): void;

    addEffect(interactionIdx: number): void;
    updateEffect(interactionIdx: number, effectIdx: number, effect: Effect): void;
    deleteEffect(interactionIdx: number, effectIdx: number): void;
}

export const useEditorStore = create<EditorState>()(
    persist(
        (set) => ({
            project: DEFAULT_PROJECT,
            selectedLocationId: null,
            selectedInteractionIdx: null,

            setProjectName: (name) => set((s) => ({ project: { ...s.project, name } })),
            setProjectId: (id) => set((s) => ({ project: { ...s.project, id } })),
            setStartLocation: (id) => set((s) => ({ project: { ...s.project, startLocationId: id } })),

            addLocation: () => set((s) => {
                const loc = makeLocation();
                return { project: { ...s.project, locations: [...s.project.locations, loc] }, selectedLocationId: loc.id };
            }),
            updateLocation: (id, patch) => set((s) => ({
                project: { ...s.project, locations: s.project.locations.map((l) => l.id === id ? { ...l, ...patch } : l) },
            })),
            deleteLocation: (id) => set((s) => ({
                project: { ...s.project, locations: s.project.locations.filter((l) => l.id !== id) },
                selectedLocationId: s.selectedLocationId === id ? null : s.selectedLocationId,
            })),
            selectLocation: (id) => set({ selectedLocationId: id }),

            addItem: (locationId) => set((s) => ({
                project: { ...s.project, locations: s.project.locations.map((l) =>
                    l.id === locationId ? { ...l, items: [...l.items, makeItem()] } : l) },
            })),
            updateItem: (locationId, itemId, patch) => set((s) => ({
                project: { ...s.project, locations: s.project.locations.map((l) =>
                    l.id === locationId ? { ...l, items: l.items.map((i) => i.id === itemId ? { ...i, ...patch } : i) } : l) },
            })),
            deleteItem: (locationId, itemId) => set((s) => ({
                project: { ...s.project, locations: s.project.locations.map((l) =>
                    l.id === locationId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l) },
            })),

            addExit: (locationId) => set((s) => ({
                project: { ...s.project, locations: s.project.locations.map((l) =>
                    l.id === locationId ? { ...l, exits: [...l.exits, makeExit()] } : l) },
            })),
            updateExit: (locationId, idx, patch) => set((s) => ({
                project: { ...s.project, locations: s.project.locations.map((l) =>
                    l.id === locationId ? { ...l, exits: l.exits.map((e, i) => i === idx ? { ...e, ...patch } : e) } : l) },
            })),
            deleteExit: (locationId, idx) => set((s) => ({
                project: { ...s.project, locations: s.project.locations.map((l) =>
                    l.id === locationId ? { ...l, exits: l.exits.filter((_, i) => i !== idx) } : l) },
            })),

            addInteraction: () => set((s) => ({
                project: { ...s.project, interactions: [...s.project.interactions, makeInteraction()] },
                selectedInteractionIdx: s.project.interactions.length,
            })),
            updateInteraction: (idx, patch) => set((s) => ({
                project: { ...s.project, interactions: s.project.interactions.map((n, i) => i === idx ? { ...n, ...patch } : n) },
            })),
            deleteInteraction: (idx) => set((s) => {
                const sel = s.selectedInteractionIdx;
                return {
                    project: { ...s.project, interactions: s.project.interactions.filter((_, i) => i !== idx) },
                    selectedInteractionIdx: sel === null || sel === idx ? null : sel > idx ? sel - 1 : sel,
                };
            }),
            selectInteraction: (idx) => set({ selectedInteractionIdx: idx }),

            addEffect: (interactionIdx) => set((s) => ({
                project: { ...s.project, interactions: s.project.interactions.map((n, i) =>
                    i === interactionIdx ? { ...n, effects: [...(n.effects ?? []), DEFAULT_EFFECT] } : n) },
            })),
            updateEffect: (interactionIdx, effectIdx, effect) => set((s) => ({
                project: { ...s.project, interactions: s.project.interactions.map((n, i) =>
                    i === interactionIdx ? { ...n, effects: (n.effects ?? []).map((e, j) => j === effectIdx ? effect : e) } : n) },
            })),
            deleteEffect: (interactionIdx, effectIdx) => set((s) => ({
                project: { ...s.project, interactions: s.project.interactions.map((n, i) =>
                    i === interactionIdx ? { ...n, effects: (n.effects ?? []).filter((_, j) => j !== effectIdx) } : n) },
            })),
        }),
        { name: 'dragon-drop-editor' },
    ),
);
