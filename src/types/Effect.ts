export type Effect =
    | { type: 'addItem'; itemId: string }
    | { type: 'removeItem'; itemId: string }
    | { type: 'transformItem'; fromId: string; toId: string }
    | { type: 'unlockExit'; locationId: string; destination: string }
    | { type: 'setFlag'; key: string; value: unknown }
    | { type: 'triggerDialogue'; dialogueId: string };
