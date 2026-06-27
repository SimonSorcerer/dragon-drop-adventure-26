import { useEditorStore } from '../../utils/useEditorStore';
import style from './InteractionList.module.css';

export const InteractionList = () => {
    const { project, selectedInteractionIdx, addInteraction, deleteInteraction, selectInteraction } = useEditorStore();

    return (
        <div className={style.list}>
            <div className={style.header}>
                <span>Interactions</span>
                <button className={style.addBtn} onClick={addInteraction}>+</button>
            </div>
            {project.interactions.map((ix, i) => (
                <div
                    key={i}
                    className={`${style.row} ${i === selectedInteractionIdx ? style.selected : ''}`}
                    onClick={() => selectInteraction(i)}
                >
                    <span className={style.keys}>
                        {ix.keys[0] || '?'} + {ix.keys[1] || '?'}
                    </span>
                    <button
                        className={style.deleteBtn}
                        onClick={(e) => { e.stopPropagation(); deleteInteraction(i); }}
                    >×</button>
                </div>
            ))}
            {project.interactions.length === 0 && (
                <p className={style.hint}>No interactions yet.</p>
            )}
        </div>
    );
};
