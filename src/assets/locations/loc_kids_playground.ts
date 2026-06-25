import type { Location } from '@type/Location';

export const loc_kids_playground: Location = {
    id: 'kids_playground',
    name: "Children's Playground",
    description: `A small playground tucked behind a row of residential buildings. The swings hang motionless, their chains furred with rust. A wooden climbing frame lists to one side, half-rotted. Painted animal shapes on the ground have faded to near-invisibility. The whole place has the feeling of somewhere long abandoned. {{exit:loc_behind_hlavka_pub}} is accessible to the south.`,
    photo: '',
    items: [],
    exits: [
        {
            direction: 'south',
            destination: 'loc_behind_hlavka_pub',
            description: 'Alley Behind the Hlávka Pub',
        },
    ],
};
