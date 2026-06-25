export type HoveredInteractable =
    | { type: 'item'; id: string }
    | { type: 'exit'; destination: string };
