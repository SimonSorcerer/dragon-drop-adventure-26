import type { Effect } from '@type/Effect';
import { useEditorStore } from '../../utils/useEditorStore';
import style from './EffectEditor.module.css';

interface Props { effect: Effect; interactionIdx: number; effectIdx: number; }

const EFFECT_TYPES: Effect['type'][] = [
    'addItem', 'removeItem', 'transformItem', 'unlockExit', 'setFlag', 'triggerDialogue',
];

export const EffectEditor = ({ effect, interactionIdx, effectIdx }: Props) => {
    const { project, updateEffect, deleteEffect } = useEditorStore();

    const up = (next: Effect) => updateEffect(interactionIdx, effectIdx, next);
    const changeType = (type: Effect['type']) => {
        const defaults: Record<Effect['type'], Effect> = {
            addItem: { type: 'addItem', itemId: '' },
            removeItem: { type: 'removeItem', itemId: '' },
            transformItem: { type: 'transformItem', fromId: '', toId: '' },
            unlockExit: { type: 'unlockExit', locationId: '', destination: '' },
            setFlag: { type: 'setFlag', key: '', value: '' },
            triggerDialogue: { type: 'triggerDialogue', dialogueId: '' },
        };
        up(defaults[type]);
    };

    const locationOptions = project.locations.map((l) => ({ value: l.id, label: l.name || l.id }));

    return (
        <div className={style.effect}>
            <select className={style.typeSelect} value={effect.type} onChange={(e) => changeType(e.target.value as Effect['type'])}>
                {EFFECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className={style.fields}>
                {effect.type === 'addItem' && <input className={style.input} placeholder='itemId' value={effect.itemId} onChange={(e) => up({ type: 'addItem', itemId: e.target.value })} />}
                {effect.type === 'removeItem' && <input className={style.input} placeholder='itemId' value={effect.itemId} onChange={(e) => up({ type: 'removeItem', itemId: e.target.value })} />}
                {effect.type === 'transformItem' && <>
                    <input className={style.input} placeholder='fromId' value={effect.fromId} onChange={(e) => up({ type: 'transformItem', fromId: e.target.value, toId: effect.toId })} />
                    <input className={style.input} placeholder='toId' value={effect.toId} onChange={(e) => up({ type: 'transformItem', fromId: effect.fromId, toId: e.target.value })} />
                </>}
                {effect.type === 'unlockExit' && <>
                    <select className={style.input} value={effect.locationId} onChange={(e) => up({ type: 'unlockExit', locationId: e.target.value, destination: effect.destination })}>
                        <option value=''>— location —</option>
                        {locationOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <select className={style.input} value={effect.destination} onChange={(e) => up({ type: 'unlockExit', locationId: effect.locationId, destination: e.target.value })}>
                        <option value=''>— destination —</option>
                        {locationOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </>}
                {effect.type === 'setFlag' && <>
                    <input className={style.input} placeholder='flag key' value={effect.key} onChange={(e) => up({ type: 'setFlag', key: e.target.value, value: effect.value })} />
                    <input className={style.input} placeholder='value' value={String(effect.value)} onChange={(e) => up({ type: 'setFlag', key: effect.key, value: e.target.value })} />
                </>}
                {effect.type === 'triggerDialogue' && <input className={style.input} placeholder='dialogueId' value={effect.dialogueId} onChange={(e) => up({ type: 'triggerDialogue', dialogueId: e.target.value })} />}
            </div>
            <button className={style.deleteBtn} onClick={() => deleteEffect(interactionIdx, effectIdx)}>×</button>
        </div>
    );
};
