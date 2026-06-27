import type { Location } from '@type/Location';
import { useEditorStore } from '../../utils/useEditorStore';
import { Field } from '../ui/Field';
import { ItemSection } from '../itemSection/ItemSection';
import { ExitSection } from '../exitSection/ExitSection';
import style from './LocationEditor.module.css';

interface Props { location: Location; }

function toId(name: string) {
    return 'loc_' + name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

export const LocationEditor = ({ location }: Props) => {
    const { updateLocation } = useEditorStore();
    const up = (patch: Partial<Location>) => updateLocation(location.id, patch);

    const handleNameChange = (name: string) => {
        const derived = toId(name);
        up({ name, id: derived });
    };

    return (
        <div className={style.editor}>
            <div className={style.row}>
                <Field label='Name' value={location.name} onChange={handleNameChange} placeholder='Village Square' />
                <Field label='ID' value={location.id} onChange={(id) => up({ id })} placeholder='village_square' mono />
            </div>
            <Field
                label='Description (use {{item_id}} and {{exit:destination_id}} placeholders)'
                value={location.description}
                onChange={(description) => up({ description })}
                multiline
                placeholder='You stand in the square. A {{rusty_key}} lies on the cobblestones. Head {{exit:dark_alley}} to explore further.'
            />
            <ItemSection location={location} />
            <ExitSection location={location} />
        </div>
    );
};
