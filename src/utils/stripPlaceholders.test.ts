import { describe, it, expect } from 'vitest';
import type { Item } from '@type/Location';
import { stripPlaceholders } from './stripPlaceholders';

const items: Record<string, Item> = {
    broken_bottle: { id: 'broken_bottle', name: 'broken bottle', description: '', interactive: true, canPickup: true },
    wooden_crate: { id: 'wooden_crate', name: 'wooden crate', description: '', interactive: true, canPickup: false },
    drainpipe: { id: 'drainpipe', name: 'rusty drainpipe', description: '', interactive: true, canPickup: false },
};

describe('stripPlaceholders', () => {
    it('returns text unchanged when no placeholders present', () => {
        expect(stripPlaceholders('A plain sentence.', items)).toBe('A plain sentence.');
    });

    it('replaces a known item id with its name', () => {
        expect(stripPlaceholders('You see a {{broken_bottle}}.', items)).toBe(
            'You see a broken bottle.',
        );
    });

    it('falls back to the raw id for unknown item ids', () => {
        expect(stripPlaceholders('A {{ghost_item}} appears.', items)).toBe('A ghost_item appears.');
    });

    it('replaces multiple placeholders in a single string', () => {
        expect(stripPlaceholders('{{wooden_crate}} next to {{drainpipe}}.', items)).toBe(
            'wooden crate next to rusty drainpipe.',
        );
    });

    it('handles an empty string', () => {
        expect(stripPlaceholders('', items)).toBe('');
    });
});
