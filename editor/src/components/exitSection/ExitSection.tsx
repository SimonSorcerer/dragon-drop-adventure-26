import { useState } from 'react';
import type { Location, LocationExit } from '@type/Location';
import { useEditorStore } from '../../utils/useEditorStore';
import { Field, SelectField } from '../ui/Field';
import style from './ExitSection.module.css';

interface Props { location: Location; }

export const ExitSection = ({ location }: Props) => {
    const { project, addExit, updateExit, deleteExit } = useEditorStore();
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const toggle = (i: number) => setExpandedIdx((prev) => (prev === i ? null : i));

    const locationOptions = project.locations
        .filter((l) => l.id !== location.id)
        .map((l) => ({ value: l.id, label: l.name || l.id }));

    return (
        <section className={style.section}>
            <div className={style.header}>
                <span>Exits ({location.exits.length})</span>
                <button className={style.addBtn} onClick={() => addExit(location.id)}>+ Add exit</button>
            </div>
            {location.exits.map((exit, i) => (
                <div key={i} className={style.exit}>
                    <div className={style.row} onClick={() => toggle(i)}>
                        <span className={style.arrow}>{expandedIdx === i ? '▾' : '▸'}</span>
                        <span className={style.dir}>{exit.direction || '—'}</span>
                        <span className={style.dest}>→ {exit.destination || '?'}</span>
                        <button className={style.deleteBtn} onClick={(e) => { e.stopPropagation(); deleteExit(location.id, i); }}>×</button>
                    </div>
                    {expandedIdx === i && (
                        <ExitForm locationId={location.id} exit={exit} idx={i} locationOptions={locationOptions} onUpdate={updateExit} />
                    )}
                </div>
            ))}
        </section>
    );
};

interface FormProps {
    locationId: string;
    exit: LocationExit;
    idx: number;
    locationOptions: { value: string; label: string }[];
    onUpdate: (locationId: string, idx: number, patch: Partial<LocationExit>) => void;
}

const ExitForm = ({ locationId, exit, idx, locationOptions, onUpdate }: FormProps) => {
    const up = (patch: Partial<LocationExit>) => onUpdate(locationId, idx, patch);
    return (
        <div className={style.form}>
            <div className={style.formRow}>
                <Field label='Direction (prose label)' value={exit.direction} onChange={(direction) => up({ direction })} placeholder='north' />
                <SelectField label='Destination' value={exit.destination} options={locationOptions} onChange={(destination) => up({ destination })} />
            </div>
            <Field label='Description' value={exit.description} onChange={(description) => up({ description })} placeholder='A narrow alleyway heading north' />
        </div>
    );
};
