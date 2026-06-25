import { loc01 } from '../../assets/locations/loc01';
import { useLocation } from '../../utils/useLocation';
import type { Location as LocationData } from '../../types/Location';
import style from './Location.module.css';

interface LocationProps {
    locationData?: LocationData;
}

export const Location = ({ locationData = loc01 }: LocationProps) => {
    const { description } = useLocation(locationData);

    return <div className={style.location}>{description}</div>;
};
