import type { Location } from '../types/Location';
import { parseLocationDescription } from './parseLocationDescription';
import { resolveDescription } from './resolveDescription';
import { useGameStore } from './useGameStore';

export const useLocation = (location: Location) => {
    const flags = useGameStore((state) => state.flags);
    const resolvedDescription = resolveDescription(location, flags);
    const description = parseLocationDescription(resolvedDescription);
    const items = location.items;
    const exits = location.exits;

    return {
        description,
        items,
        exits,
    };
};
