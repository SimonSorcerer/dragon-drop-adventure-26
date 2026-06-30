import { useGameStore } from '@utils/useGameStore';
import { useLocation } from '@utils/useLocation';
import style from './Location.module.css';

export const Location = () => {
    const location = useGameStore((state) => state.locations[state.currentLocationId]);
    const { description } = useLocation(location);

    return <div className={style.location}>{description}</div>;
};
