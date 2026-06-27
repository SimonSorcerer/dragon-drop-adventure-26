import type { Interaction } from '@type/Interaction';
import { useEditorStore } from '../../utils/useEditorStore';
import { Field } from '../ui/Field';
import { EffectEditor } from '../effectEditor/EffectEditor';
import style from './InteractionEditor.module.css';

interface Props { interaction: Interaction; idx: number; }

export const InteractionEditor = ({ interaction, idx }: Props) => {
    const { project, updateInteraction, addEffect } = useEditorStore();

    const allItemIds = project.locations.flatMap((l) => l.items.map((i) => i.id));

    const up = (patch: Partial<Interaction>) => updateInteraction(idx, patch);

    const setKey = (slot: 0 | 1, value: string) => {
        const keys: [string, string] = [...interaction.keys] as [string, string];
        keys[slot] = value;
        up({ keys });
    };

    return (
        <div className={style.editor}>
            <div className={style.keys}>
                <KeySelect label='Item A' value={interaction.keys[0]} options={allItemIds} onChange={(v) => setKey(0, v)} />
                <span className={style.plus}>+</span>
                <KeySelect label='Item B' value={interaction.keys[1]} options={allItemIds} onChange={(v) => setKey(1, v)} />
            </div>
            <Field label='Prefix (shown in action bar)' value={interaction.prefix} onChange={(prefix) => up({ prefix })} placeholder='Use key with door' />
            <Field label='Result text' value={interaction.text} onChange={(text) => up({ text })} multiline placeholder='The key turns. The door swings open.' />

            <div className={style.effectsHeader}>
                <span>Effects ({interaction.effects?.length ?? 0})</span>
                <button className={style.addBtn} onClick={() => addEffect(idx)}>+ Add effect</button>
            </div>
            {(interaction.effects ?? []).map((effect, ei) => (
                <EffectEditor key={ei} effect={effect} interactionIdx={idx} effectIdx={ei} />
            ))}
        </div>
    );
};

interface KeySelectProps {
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
}

const KeySelect = ({ label, value, options, onChange }: KeySelectProps) => (
    <label className={style.keySelect}>
        <span className={style.keyLabel}>{label}</span>
        <input
            list={`${label}-list`}
            className={style.keyInput}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder='item_id'
        />
        <datalist id={`${label}-list`}>
            {options.map((o) => <option key={o} value={o} />)}
        </datalist>
    </label>
);
