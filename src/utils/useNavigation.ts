import { locations } from '@assets/locations/locations';
import { stripPlaceholders } from './stripPlaceholders';
import { useGameStore } from './useGameStore';

export function useNavigation() {
    const navigateTo = useGameStore((state) => state.navigateTo);
    const addLogEntry = useGameStore((state) => state.addLogEntry);

    return (locationId: string) => {
        const location = locations[locationId];
        if (!location) return;
        navigateTo(locationId);
        addLogEntry({ text: stripPlaceholders(location.description) });
    };
}
