import type { Location } from '@type/Location';
import { useEditorStore } from '../../utils/useEditorStore';
import { Field } from '../ui/Field';
import { ItemSection } from '../itemSection/ItemSection';
import { ExitSection } from '../exitSection/ExitSection';
import style from './LocationEditor.module.css';

const ReadOnlyId = ({ id, duplicate }: { id: string; duplicate: boolean }) => (
    <div className={style.idField}>
        <span className={style.idLabel}>ID</span>
        <span className={`${style.idValue} ${duplicate ? style.idError : ''}`}>{id}</span>
        {duplicate && <span className={style.idErrorMsg}>ID already in use</span>}
    </div>
);

interface Props { location: Location; }

function toId(name: string) {
    return 'loc_' + name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

function uniqueId(base: string, takenIds: string[]): string {
    if (!takenIds.includes(base)) return base;
    let n = 2;
    while (takenIds.includes(`${base}_${n}`)) n++;
    return `${base}_${n}`;
}

export const LocationEditor = ({ location }: Props) => {
    const { project, updateLocation, selectLocation } = useEditorStore();
    const up = (patch: Partial<Location>) => updateLocation(location.id, patch);

    const otherIds = project.locations.filter((l) => l.id !== location.id).map((l) => l.id);
    const isDuplicate = otherIds.includes(location.id);

    const handleNameBlur = (name: string) => {
        const derived = uniqueId(toId(name), otherIds);
        up({ id: derived });
        selectLocation(derived);
    };

    return (
        <div className={style.editor}>
            <div className={style.row}>
                <Field label='Name' value={location.name} onChange={(name) => up({ name })} onBlur={handleNameBlur} placeholder='Village Square' />
                <ReadOnlyId id={location.id} duplicate={isDuplicate} />
            </div>
            <Field
                label='Description (use {{item_id}} and {{exit:destination_id}} placeholders)'
                value={location.description}
                onChange={(description) => up({ description })}
                multiline
                storageKey='location-description'
                placeholder='You stand in the square. A {{rusty_key}} lies on the cobblestones. Head {{exit:dark_alley}} to explore further.'
            />
            <ItemSection location={location} />
            <ExitSection location={location} />
        </div>
    );
};
