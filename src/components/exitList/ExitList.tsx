import clsx from 'clsx';
import { locations } from '@assets/locations/locations';
import { useNavigation } from '@utils/useNavigation';
import { useGameStore } from '@utils/useGameStore';
import style from './ExitList.module.css';

export const ExitList = () => {
    const currentLocationId = useGameStore((state) => state.currentLocationId);
    const flags = useGameStore((state) => state.flags);
    const setHoveredInteractable = useGameStore((state) => state.setHoveredInteractable);
    const navigate = useNavigation();

    const location = locations[currentLocationId];
    if (!location || location.exits.length === 0) return null;

    return (
        <div className={style.exitList}>
            <span>Exits: </span>
            {location.exits.map((exit, index) => {
                const isLocked =
                    !!exit.locked &&
                    !flags[
                        `exit_unlocked:${currentLocationId}:${exit.destination}`
                    ];
                return (
                    <span
                        key={exit.destination}
                        className={clsx(style.exit, isLocked && style.locked)}
                        onClick={() => !isLocked && navigate(exit.destination)}
                        onMouseEnter={() => setHoveredInteractable({ type: 'exit', destination: exit.destination })}
                        onMouseLeave={() => setHoveredInteractable(null)}
                        role='link'
                        aria-disabled={isLocked}
                    >
                        <span className={style.number}>{index + 1}.</span>{' '}
                        {exit.description}
                    </span>
                );
            })}
        </div>
    );
};
