import { useEditorStore } from '../../utils/useEditorStore';
import { InteractionList } from '../interactionList/InteractionList';
import { InteractionEditor } from '../interactionEditor/InteractionEditor';
import style from './InteractionsView.module.css';

export const InteractionsView = () => {
    const { project, selectedInteractionIdx } = useEditorStore();
    const selected = selectedInteractionIdx !== null ? project.interactions[selectedInteractionIdx] : null;

    return (
        <div className={style.view}>
            <aside className={style.sidebar}>
                <InteractionList />
            </aside>
            <div className={style.detail}>
                {selected && selectedInteractionIdx !== null
                    ? <InteractionEditor interaction={selected} idx={selectedInteractionIdx} />
                    : <p className={style.empty}>Select an interaction or create one.</p>}
            </div>
        </div>
    );
};
