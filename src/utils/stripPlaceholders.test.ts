import { describe, it, expect } from 'vitest';
import { stripPlaceholders } from './stripPlaceholders';

describe('stripPlaceholders', () => {
    it('returns text unchanged when no placeholders present', () => {
        expect(stripPlaceholders('A plain sentence.')).toBe('A plain sentence.');
    });

    it('replaces a known item id with its name', () => {
        expect(stripPlaceholders('You see a {{broken_bottle}}.')).toBe(
            'You see a broken bottle.',
        );
    });

    it('falls back to the raw id for unknown item ids', () => {
        expect(stripPlaceholders('A {{ghost_item}} appears.')).toBe('A ghost_item appears.');
    });

    it('replaces multiple placeholders in a single string', () => {
        expect(stripPlaceholders('{{wooden_crate}} next to {{drainpipe}}.')).toBe(
            'wooden crate next to rusty drainpipe.',
        );
    });

    it('handles an empty string', () => {
        expect(stripPlaceholders('')).toBe('');
    });
});
