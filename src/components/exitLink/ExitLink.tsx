import clsx from 'clsx';
import { locations } from '@assets/locations/locations';
import { useNavigation } from '@utils/useNavigation';
import { useGameStore } from '@utils/useGameStore';
import style from './ExitLink.module.css';

interface ExitLinkProps {
    destination: string;
}

export const ExitLink = ({ destination }: ExitLinkProps) => {
    const currentLocationId = useGameStore((state) => state.currentLocationId);
    const flags = useGameStore((state) => state.flags);
    const setHoveredInteractable = useGameStore((state) => state.setHoveredInteractable);
    const navigate = useNavigation();

    const location = locations[currentLocationId];
    const exit = location?.exits.find((e) => e.destination === destination);

    if (!exit) return <span>{destination}</span>;

    const isLocked =
        !!exit.locked && !flags[`exit_unlocked:${currentLocationId}:${destination}`];

    return (
        <span
            className={clsx(style.exitLink, isLocked && style.locked)}
            onClick={() => !isLocked && navigate(exit.destination)}
            onMouseEnter={() => setHoveredInteractable({ type: 'exit', destination: exit.destination })}
            onMouseLeave={() => setHoveredInteractable(null)}
            role='link'
            aria-disabled={isLocked}
        >
            {exit.description}
        </span>
    );
};
