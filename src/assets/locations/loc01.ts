import type { Location } from '@type/Location';
import { items } from '../items/items';
import pubAlleyImg from '../drag_drop_pub_alley.png';

export const loc01: Location = {
    id: 'loc_behind_hlavka_pub',
    name: 'Alley Behind the Hlávka Pub',
    description: `You wake with a pounding headache in a narrow cobblestone alley behind the Hlávka pub, the grey light of early morning filtering through the mist. You can't remember how you got here or what happened last night. The air is thick with the smell of stale ale and rotting vegetables. A rusty {{drainpipe}} runs down the brick wall, and beneath it sits a weathered {{wooden_crate}} marked with faded shipping labels. Near your feet, you notice a {{broken_bottle}} glinting in the dim light. The pub's back {{door}} is firmly shut, secured by a heavy {{iron_padlock}}. A narrow passage leads to {{exit:village_square}}, while the alley continues into {{exit:dark_alley}}.`,
    descriptionVariants: [
        {
            when: 'item_taken:broken_bottle',
            description: `You wake with a pounding headache in a narrow cobblestone alley behind the Hlávka pub, the grey light of early morning filtering through the mist. You can't remember how you got here or what happened last night. The air is thick with the smell of stale ale and rotting vegetables. A rusty {{drainpipe}} runs down the brick wall, and beneath it sits a weathered {{wooden_crate}} marked with faded shipping labels. The pub's back {{door}} is firmly shut, secured by a heavy {{iron_padlock}}. A narrow passage leads to {{exit:village_square}}, while the alley continues into {{exit:dark_alley}}.`,
        },
    ],
    images: {
        retro: pubAlleyImg,
    },
    items: [
        items.drainpipe,
        items.wooden_crate,
        items.broken_bottle,
        items.door,
        items.iron_padlock,
    ],
    exits: [
        {
            direction: 'south',
            destination: 'village_square',
            description: 'Village Square',
        },
        {
            direction: 'north',
            destination: 'kids_playground',
            description: "Children's Playground",
            locked: true,
        },
        {
            direction: 'west',
            destination: 'dark_alley',
            description: 'Dark Alley',
        },
    ],
};
