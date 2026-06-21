interface Interaction {
    keys: [string, string];
    prefix: string;
    text: string;
}

export const interactions: Interaction[] = [
    {
        keys: ['broken_bottle', 'iron_padlock'],
        prefix: 'Use bottle with padlock',
        text: "You try to pry the padlock with the broken bottle but it won't budge.",
    },
    {
        keys: ['broken_bottle', 'wooden_crate'],
        prefix: 'Break crate with bottle',
        text: 'You smash the bottle against the crate. Both are now in worse shape.',
    },
    {
        keys: ['broken_bottle', 'drainpipe'],
        prefix: 'Use bottle with drainpipe',
        text: 'You clang the bottle against the drainpipe. Nothing useful happens.',
    },
];

export function findInteraction(itemId: string, targetId: string): Interaction | undefined {
    return interactions.find(
        (i) =>
            (i.keys[0] === itemId && i.keys[1] === targetId) ||
            (i.keys[0] === targetId && i.keys[1] === itemId),
    );
}
