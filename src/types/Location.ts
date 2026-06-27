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
    locked?: boolean;
}

export interface DescriptionVariant {
    when: string | string[];
    description: string;
}

export interface LocationImages {
    ascii?: string;
    retro?: string;
    modern?: string;
}

export interface Location {
    id: string;
    name: string;
    description: string;
    descriptionVariants?: DescriptionVariant[];
    images: LocationImages;
    items: Item[];
    exits: LocationExit[];
}
