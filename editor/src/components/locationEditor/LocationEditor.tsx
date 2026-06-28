import type { Location } from '@type/Location';
import { useEditorStore } from '../../utils/useEditorStore';
import { Field } from '../ui/Field';
import { ReadOnlyId } from '../ui/ReadOnlyId';
import { ItemSection } from '../itemSection/ItemSection';
import { ExitSection } from '../exitSection/ExitSection';
import { slugify, uniqueId } from '../../utils/idUtils';
import style from './LocationEditor.module.css';

interface Props {
    location: Location;
}

function toId(name: string): string {
    return 'loc_' + slugify(name);
}

export const LocationEditor = ({ location }: Props) => {
    const { project, updateLocation, selectLocation } = useEditorStore();
    const up = (patch: Partial<Location>) => updateLocation(location.id, patch);

    const otherIds = project.locations
        .filter((l) => l.id !== location.id)
        .map((l) => l.id);

    const handleNameBlur = (name: string) => {
        const derived = uniqueId(toId(name), otherIds);
        if (derived !== location.id) {
            up({ id: derived });
            selectLocation(derived);
        }
    };

    return (
        <div className={style.editor}>
            <div className={style.row}>
                <Field
                    label='Name'
                    value={location.name}
                    onChange={(name) => up({ name })}
                    onBlur={handleNameBlur}
                    placeholder='Village Square'
                />
                <ReadOnlyId id={location.id} />
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
