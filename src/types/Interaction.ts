import type { Effect } from './Effect';

export interface Interaction {
    keys: [string, string];
    prefix: string;
    text: string;
    effects?: Effect[];
}
