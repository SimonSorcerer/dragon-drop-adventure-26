import { items } from '@assets/items/items';

export function stripPlaceholders(text: string): string {
    return text.replace(/\{\{(\w+)\}\}/g, (_, id) => items[id]?.name ?? id);
}
