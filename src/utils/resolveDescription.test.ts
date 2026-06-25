import { describe, it, expect } from 'vitest';
import { resolveDescription } from './resolveDescription';
import type { Location } from '@type/Location';

const base = 'Base description.';

const location = (variants?: Location['descriptionVariants']): Location => ({
    id: 'test',
    name: 'Test',
    description: base,
    photo: '',
    items: [],
    exits: [],
    descriptionVariants: variants,
});

describe('resolveDescription', () => {
    it('returns base description when no variants defined', () => {
        expect(resolveDescription(location(), {})).toBe(base);
    });

    it('returns base description when no flags match', () => {
        const loc = location([{ when: 'item_taken:bottle', description: 'Variant.' }]);
        expect(resolveDescription(loc, {})).toBe(base);
    });

    it('returns variant when single flag condition is met', () => {
        const loc = location([{ when: 'item_taken:bottle', description: 'Variant.' }]);
        expect(resolveDescription(loc, { 'item_taken:bottle': true })).toBe('Variant.');
    });

    it('returns base description when single flag condition is not met', () => {
        const loc = location([{ when: 'item_taken:bottle', description: 'Variant.' }]);
        expect(resolveDescription(loc, { 'item_taken:key': true })).toBe(base);
    });

    it('returns variant when all array conditions are met', () => {
        const loc = location([
            { when: ['item_taken:bottle', 'gate_unlocked'], description: 'Multi-flag variant.' },
        ]);
        expect(resolveDescription(loc, { 'item_taken:bottle': true, gate_unlocked: true })).toBe(
            'Multi-flag variant.',
        );
    });

    it('returns base description when only some array conditions are met', () => {
        const loc = location([
            { when: ['item_taken:bottle', 'gate_unlocked'], description: 'Multi-flag variant.' },
        ]);
        expect(resolveDescription(loc, { 'item_taken:bottle': true })).toBe(base);
    });

    it('returns the first matching variant (ordering guarantee)', () => {
        const loc = location([
            { when: 'item_taken:bottle', description: 'First match.' },
            { when: 'item_taken:bottle', description: 'Second match.' },
        ]);
        expect(resolveDescription(loc, { 'item_taken:bottle': true })).toBe('First match.');
    });

    it('skips non-matching variants and returns the first match', () => {
        const loc = location([
            { when: 'gate_unlocked', description: 'Gate variant.' },
            { when: 'item_taken:bottle', description: 'Bottle variant.' },
        ]);
        expect(resolveDescription(loc, { 'item_taken:bottle': true })).toBe('Bottle variant.');
    });
});
