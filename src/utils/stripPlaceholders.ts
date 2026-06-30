import type { Item } from '@type/Location';

export function stripPlaceholders(text: string, items: Record<string, Item>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (_, id) => items[id]?.name ?? id);
}
