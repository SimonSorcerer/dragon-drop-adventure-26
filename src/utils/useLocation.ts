import type { Location } from '../types/Location';
import { parseLocationDescription } from './parseLocationDescription';

export const useLocation = (location: Location) => {
    const description = parseLocationDescription(location.description);
    const items = location.items;
    const exits = location.exits;

    // Placeholder for location-related logic
    return {
        description,
        items,
        exits,
    };
};
