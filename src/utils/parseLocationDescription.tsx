import type { ReactNode } from 'react';
import { Item } from '../components/item/Item';

/**
 * Parses location description text and replaces {{item_id}} placeholders
 * with <Item id="item_id" /> components.
 */
export function parseLocationDescription(description: string): ReactNode[] {
    const parts: ReactNode[] = [];
    const regex = /\{\{(\w+)\}\}/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(description)) !== null) {
        // Add text before the placeholder
        if (match.index > lastIndex) {
            parts.push(description.substring(lastIndex, match.index));
        }

        // Add the Item component
        const itemId = match[1];
        parts.push(<Item context='location' key={itemId} id={itemId} />);

        lastIndex = regex.lastIndex;
    }

    // Add remaining text after the last placeholder
    if (lastIndex < description.length) {
        parts.push(description.substring(lastIndex));
    }

    return parts;
}
