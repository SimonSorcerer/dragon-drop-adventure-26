import type { Location } from '@type/Location';
import { parseLocationDescription } from './parseLocationDescription';
import { resolveDescription } from './resolveDescription';
import { useGameStore } from './useGameStore';

export const useLocation = (location: Location | undefined) => {
    const flags = useGameStore((state) => state.flags);

    if (!location) return { description: [], items: [], exits: [] };

    const resolvedDescription = resolveDescription(location, flags);
    const description = parseLocationDescription(resolvedDescription);

    return { description, items: location.items, exits: location.exits };
};
