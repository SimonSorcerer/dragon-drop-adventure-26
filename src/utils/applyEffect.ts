import type { Effect } from '@type/Effect';
import type { GameState } from './useGameStore';

function findItemLocation(
    state: GameState,
    itemId: string,
): 'inventory' | string | null {
    if (state.inventory.has(itemId)) return 'inventory';
    for (const [locId, items] of Object.entries(state.locationItems)) {
        if (items.has(itemId)) return locId;
    }
    return null;
}

function withoutItem(
    state: GameState,
    itemId: string,
    loc: string,
): Partial<GameState> {
    if (loc === 'inventory') {
        const next = new Set(state.inventory);
        next.delete(itemId);
        return { inventory: next };
    }
    const next = new Set(state.locationItems[loc]);
    next.delete(itemId);
    return { locationItems: { ...state.locationItems, [loc]: next } };
}

export function applyEffectToState(
    effect: Effect,
    state: GameState,
): Partial<GameState> {
    switch (effect.type) {
        case 'addItem':
            return { inventory: new Set(state.inventory).add(effect.itemId) };

        case 'removeItem': {
            const loc = findItemLocation(state, effect.itemId);
            return loc ? withoutItem(state, effect.itemId, loc) : {};
        }

        case 'transformItem': {
            const loc = findItemLocation(state, effect.fromId);
            if (!loc) return {};

            const without = withoutItem(state, effect.fromId, loc);
            if (loc === 'inventory') {
                return {
                    inventory: new Set(without.inventory).add(effect.toId),
                };
            }
            const next = new Set(without.locationItems![loc]);
            next.add(effect.toId);
            return { locationItems: { ...without.locationItems, [loc]: next } };
        }

        case 'unlockExit':
            return {
                flags: {
                    ...state.flags,
                    [`exit_unlocked:${effect.locationId}:${effect.destination}`]: true,
                },
            };

        case 'setFlag':
            return { flags: { ...state.flags, [effect.key]: effect.value } };

        case 'triggerDialogue':
            return {};
    }
}
