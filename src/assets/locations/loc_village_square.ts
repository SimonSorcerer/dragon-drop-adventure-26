import type { Location } from '@type/Location';

export const loc_village_square: Location = {
    id: 'village_square',
    name: 'Village Square',
    description: `The cobblestone square stretches out before you, ringed by narrow townhouses with shuttered windows. A stone fountain stands dry in the centre, its basin cracked and empty. The air carries an unsettling stillness — no market stalls, no pigeons, no voices. A faded notice board leans against the fountain. The {{exit:loc_behind_hlavka_pub}} lies to the north.`,
    photo: '',
    items: [],
    exits: [
        {
            direction: 'north',
            destination: 'loc_behind_hlavka_pub',
            description: 'Alley Behind the Hlávka Pub',
        },
    ],
};
