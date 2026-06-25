import { locations } from '@assets/locations/locations';
import { useGameStore } from '@utils/useGameStore';
import { useLocation } from '@utils/useLocation';
import style from './Location.module.css';

export const Location = () => {
    const currentLocationId = useGameStore((state) => state.currentLocationId);
    const { description } = useLocation(locations[currentLocationId]);

    return <div className={style.location}>{description}</div>;
};
