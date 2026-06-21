import style from './Settings.module.css';
import { Icon } from '../icons/Icon';

interface SettingsProps {}

export const Settings = ({}: SettingsProps) => {
    return (
        <div className={style.wrapper}>
            <Icon type='dark-mode' />
            <Icon type='text-size' />
            <Icon type='playback' />
        </div>
    );
};
