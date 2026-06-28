import { useState } from 'react';
import type { Location, DescriptionVariant } from '@type/Location';
import { useEditorStore } from '../../utils/useEditorStore';
import { Field } from '../ui/Field';
import style from './DescriptionVariantsSection.module.css';

function displayWhen(when: string | string[]): string {
    return Array.isArray(when) ? when.join(', ') : when;
}

function parseWhen(value: string): string | string[] {
    const parts = value.split(',').map((s) => s.trim()).filter(Boolean);
    return parts.length === 1 ? parts[0] : parts;
}

interface Props {
    location: Location;
}

export const DescriptionVariantsSection = ({ location }: Props) => {
    const { updateLocation } = useEditorStore();
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    const variants = location.descriptionVariants ?? [];

    const toggle = (i: number) => setExpandedIdx((prev) => (prev === i ? null : i));

    const addVariant = () => {
        updateLocation(location.id, {
            descriptionVariants: [...variants, { when: '', description: '' }],
        });
        setExpandedIdx(variants.length);
    };

    const updateVariant = (idx: number, patch: Partial<DescriptionVariant>) => {
        updateLocation(location.id, {
            descriptionVariants: variants.map((v, i) => (i === idx ? { ...v, ...patch } : v)),
        });
    };

    const deleteVariant = (idx: number) => {
        updateLocation(location.id, {
            descriptionVariants: variants.filter((_, i) => i !== idx),
        });
        setExpandedIdx((prev) => {
            if (prev === idx) return null;
            if (prev !== null && prev > idx) return prev - 1;
            return prev;
        });
    };

    return (
        <section className={style.section}>
            <div className={style.header}>
                <span>Description variants ({variants.length})</span>
                <button className={style.addBtn} onClick={addVariant}>+ Add variant</button>
            </div>
            {variants.map((variant, i) => (
                <div key={i} className={style.variant}>
                    <div className={style.row} onClick={() => toggle(i)}>
                        <span className={style.arrow}>{expandedIdx === i ? '▾' : '▸'}</span>
                        <span className={style.when}>
                            {displayWhen(variant.when) || <em>no condition</em>}
                        </span>
                        <button
                            className={style.deleteBtn}
                            onClick={(e) => { e.stopPropagation(); deleteVariant(i); }}
                        >×</button>
                    </div>
                    {expandedIdx === i && (
                        <VariantForm variant={variant} onUpdate={(patch) => updateVariant(i, patch)} />
                    )}
                </div>
            ))}
        </section>
    );
};

interface FormProps {
    variant: DescriptionVariant;
    onUpdate: (patch: Partial<DescriptionVariant>) => void;
}

const VariantForm = ({ variant, onUpdate }: FormProps) => {
    const [whenDraft, setWhenDraft] = useState(() => displayWhen(variant.when));

    return (
        <div className={style.form}>
            <Field
                label='Flag(s) — must all be true (comma-separate for multiple)'
                value={whenDraft}
                onChange={setWhenDraft}
                onBlur={() => onUpdate({ when: parseWhen(whenDraft) })}
                placeholder='north_gate_open'
                mono
            />
            <Field
                label='Description'
                value={variant.description}
                onChange={(description) => onUpdate({ description })}
                multiline
                placeholder='You stand in the square. The key is gone.'
            />
        </div>
    );
};
