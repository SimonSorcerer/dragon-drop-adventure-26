import { useEditorStore } from '../../utils/useEditorStore';
import style from './LocationList.module.css';

export const LocationList = () => {
    const { project, selectedLocationId, addLocation, deleteLocation, selectLocation } = useEditorStore();

    return (
        <div className={style.list}>
            <div className={style.header}>
                <span>Locations</span>
                <button className={style.addBtn} onClick={addLocation}>+</button>
            </div>
            {project.locations.map((loc) => (
                <div
                    key={loc.id}
                    className={`${style.row} ${loc.id === selectedLocationId ? style.selected : ''}`}
                    onClick={() => selectLocation(loc.id)}
                >
                    <span className={style.name}>{loc.name || <em>Unnamed</em>}</span>
                    <button
                        className={style.deleteBtn}
                        onClick={(e) => { e.stopPropagation(); deleteLocation(loc.id); }}
                    >×</button>
                </div>
            ))}
            {project.locations.length === 0 && (
                <p className={style.hint}>No locations yet.</p>
            )}
        </div>
    );
};
