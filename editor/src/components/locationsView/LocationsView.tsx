import { useEditorStore } from '../../utils/useEditorStore';
import { LocationList } from '../locationList/LocationList';
import { LocationEditor } from '../locationEditor/LocationEditor';
import style from './LocationsView.module.css';

export const LocationsView = () => {
    const { project, selectedLocationId } = useEditorStore();
    const selected = project.locations.find((l) => l.id === selectedLocationId) ?? null;

    return (
        <div className={style.view}>
            <aside className={style.sidebar}>
                <LocationList />
            </aside>
            <div className={style.detail}>
                {selected
                    ? <LocationEditor key={selected.id} location={selected} />
                    : <p className={style.empty}>Select a location or create one.</p>}
            </div>
        </div>
    );
};
