export interface Item {
    id: string;
    name: string;
    description: string;
    interactive: boolean;
    canPickup: boolean;
}

export interface LocationExit {
    direction: string;
    destination: string;
    description: string;
}

export interface Location {
    id: string;
    name: string;
    description: string;
    photo: string;
    items: Item[];
    exits: LocationExit[];
}
