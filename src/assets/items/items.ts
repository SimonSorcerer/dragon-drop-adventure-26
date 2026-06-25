import type { Item } from '@type/Location';

export const items: Record<string, Item> = {
    drainpipe: {
        id: 'drainpipe',
        name: 'rusty drainpipe',
        description: 'A rusty drainpipe attached to the brick wall.',
        interactive: true,
        canPickup: false,
    },
    wooden_crate: {
        id: 'wooden_crate',
        name: 'wooden crate',
        description: 'A weathered wooden crate with faded shipping labels.',
        interactive: true,
        canPickup: false,
    },
    broken_bottle: {
        id: 'broken_bottle',
        name: 'broken bottle',
        description: 'A broken bottle with sharp edges.',
        interactive: true,
        canPickup: true,
    },
    door: {
        id: 'door',
        name: 'back door',
        description: "The pub's back door, secured with a heavy padlock.",
        interactive: true,
        canPickup: false,
    },
    iron_padlock: {
        id: 'iron_padlock',
        name: 'iron padlock',
        description: 'A heavy iron padlock securing the door.',
        interactive: true,
        canPickup: false,
    },
};
