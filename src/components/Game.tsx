import { ActionBar } from './actionBar/ActionBar';
import style from './Game.module.css';
import { Inventory } from './inventory/Inventory';
import { Location } from './location/Location';
import { Settings } from './settings/Settings';
import { Description } from './description/Description';
import { ExitList } from './exitList/ExitList';

export const Game = () => {
    return (
        <div className={style.game}>
            <div className={style.gameHeader}>
                <h2>Dragon Drop Adventure</h2>
                <Settings />
            </div>
            <Location />
            <ExitList />
            <Description />
            <ActionBar />
            <Inventory />
        </div>
    );
};
