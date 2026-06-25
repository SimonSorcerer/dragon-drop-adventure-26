import type { Location } from '@type/Location';

export const loc_dark_alley: Location = {
    id: 'dark_alley',
    name: 'Dark Alley',
    description: `The alley narrows here until the old brick walls almost touch overhead, blocking out what little morning light there is. Moss creeps between the stones underfoot. Something drips steadily from a broken gutter above. The feeling of being watched is difficult to shake. The alley opens back east toward {{exit:loc_behind_hlavka_pub}}.`,
    photo: '',
    items: [],
    exits: [
        {
            direction: 'east',
            destination: 'loc_behind_hlavka_pub',
            description: 'Alley Behind the Hlávka Pub',
        },
    ],
};
