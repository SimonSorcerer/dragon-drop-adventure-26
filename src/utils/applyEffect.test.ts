import { describe, it, expect } from 'vitest';
import { applyEffectToState } from './applyEffect';
import type { GameState } from './useGameStore';

function makeState(overrides: Partial<GameState> = {}): GameState {
    return {
        currentLocationId: 'loc_a',
        inventory: new Set<string>(),
        locationItems: { loc_a: new Set(['sword', 'shield']), loc_b: new Set(['key']) },
        log: [],
        hoveredInteractable: null,
        flags: {},
        ...overrides,
    };
}

describe('addItem', () => {
    it('adds item to inventory', () => {
        const result = applyEffectToState({ type: 'addItem', itemId: 'potion' }, makeState());
        expect(result.inventory?.has('potion')).toBe(true);
    });
});

describe('removeItem', () => {
    it('removes item from inventory', () => {
        const state = makeState({ inventory: new Set(['key']) });
        const result = applyEffectToState({ type: 'removeItem', itemId: 'key' }, state);
        expect(result.inventory?.has('key')).toBe(false);
    });

    it('removes item from its location', () => {
        const result = applyEffectToState({ type: 'removeItem', itemId: 'sword' }, makeState());
        expect(result.locationItems?.['loc_a']?.has('sword')).toBe(false);
    });

    it('removes from inventory before location when item exists in both', () => {
        const state = makeState({ inventory: new Set(['sword']) });
        const result = applyEffectToState({ type: 'removeItem', itemId: 'sword' }, state);
        expect(result.inventory?.has('sword')).toBe(false);
        expect(result.locationItems).toBeUndefined();
    });

    it('returns empty object when item not found anywhere', () => {
        const result = applyEffectToState({ type: 'removeItem', itemId: 'ghost' }, makeState());
        expect(result).toEqual({});
    });
});

describe('transformItem', () => {
    it('swaps item in inventory', () => {
        const state = makeState({ inventory: new Set(['seed']) });
        const result = applyEffectToState({ type: 'transformItem', fromId: 'seed', toId: 'plant' }, state);
        expect(result.inventory?.has('seed')).toBe(false);
        expect(result.inventory?.has('plant')).toBe(true);
    });

    it('swaps item in its location', () => {
        const result = applyEffectToState({ type: 'transformItem', fromId: 'sword', toId: 'broken_sword' }, makeState());
        expect(result.locationItems?.['loc_a']?.has('sword')).toBe(false);
        expect(result.locationItems?.['loc_a']?.has('broken_sword')).toBe(true);
    });

    it('finds item in non-current location', () => {
        const result = applyEffectToState({ type: 'transformItem', fromId: 'key', toId: 'used_key' }, makeState());
        expect(result.locationItems?.['loc_b']?.has('key')).toBe(false);
        expect(result.locationItems?.['loc_b']?.has('used_key')).toBe(true);
    });

    it('returns empty object when item not found', () => {
        const result = applyEffectToState({ type: 'transformItem', fromId: 'ghost', toId: 'spirit' }, makeState());
        expect(result).toEqual({});
    });
});

describe('unlockExit', () => {
    it('sets the exit_unlocked flag', () => {
        const result = applyEffectToState(
            { type: 'unlockExit', locationId: 'loc_a', destination: 'loc_b' },
            makeState(),
        );
        expect(result.flags?.['exit_unlocked:loc_a:loc_b']).toBe(true);
    });

    it('preserves existing flags', () => {
        const state = makeState({ flags: { chapter: 1 } });
        const result = applyEffectToState(
            { type: 'unlockExit', locationId: 'loc_a', destination: 'loc_b' },
            state,
        );
        expect(result.flags?.['chapter']).toBe(1);
    });
});

describe('setFlag', () => {
    it('sets a flag', () => {
        const result = applyEffectToState({ type: 'setFlag', key: 'gate_open', value: true }, makeState());
        expect(result.flags?.['gate_open']).toBe(true);
    });

    it('preserves existing flags', () => {
        const state = makeState({ flags: { chapter: 1 } });
        const result = applyEffectToState({ type: 'setFlag', key: 'gate_open', value: true }, state);
        expect(result.flags?.['chapter']).toBe(1);
    });
});

describe('triggerDialogue', () => {
    it('returns empty object (not yet implemented)', () => {
        const result = applyEffectToState({ type: 'triggerDialogue', dialogueId: 'npc_intro' }, makeState());
        expect(result).toEqual({});
    });
});
