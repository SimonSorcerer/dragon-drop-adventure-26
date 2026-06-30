import { useCallback } from 'react';
import { stripPlaceholders } from './stripPlaceholders';
import { useGameStore } from './useGameStore';

export function useNavigation() {
    const navigateTo = useGameStore((state) => state.navigateTo);
    const addLogEntry = useGameStore((state) => state.addLogEntry);

    return useCallback((locationId: string) => {
        const { locations, items } = useGameStore.getState();
        const location = locations[locationId];

        if (!location) {
            return undefined;
        }

        navigateTo(locationId);
        addLogEntry({ text: stripPlaceholders(location.description, items) });
    }, [navigateTo, addLogEntry]);
}
