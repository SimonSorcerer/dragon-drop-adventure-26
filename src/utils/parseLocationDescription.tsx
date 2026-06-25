import type { ReactNode } from 'react';
import { Item } from '../components/item/Item';
import { ExitLink } from '../components/exitLink/ExitLink';

export function parseLocationDescription(description: string): ReactNode[] {
    const parts: ReactNode[] = [];
    const regex = /\{\{([\w:]+)\}\}/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(description)) !== null) {
        if (match.index > lastIndex) {
            parts.push(description.substring(lastIndex, match.index));
        }

        const token = match[1];
        if (token.startsWith('exit:')) {
            const destination = token.slice('exit:'.length);
            parts.push(<ExitLink key={`exit-${destination}`} destination={destination} />);
        } else {
            parts.push(<Item context='location' key={token} id={token} />);
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < description.length) {
        parts.push(description.substring(lastIndex));
    }

    return parts;
}
