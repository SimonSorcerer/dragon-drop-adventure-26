import type { Location } from '@type/Location';
import { loc01 } from './loc01';
import { loc_village_square } from './loc_village_square';
import { loc_dark_alley } from './loc_dark_alley';
import { loc_kids_playground } from './loc_kids_playground';

export const locations: Record<string, Location> = {
    [loc01.id]: loc01,
    [loc_village_square.id]: loc_village_square,
    [loc_dark_alley.id]: loc_dark_alley,
    [loc_kids_playground.id]: loc_kids_playground,
};
