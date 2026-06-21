import { items } from '@assets/items/items';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import { useGameStore } from '@/utils/useGameStore';
import style from './Item.module.css';

interface ItemProps {
    id: string;
    context: 'inventory' | 'location';
}

export const Item = ({ id, context }: ItemProps) => {
    const item = items[id];
    const setHoveredItem = useGameStore((state) => state.setHoveredItem);

    const { attributes, listeners, setNodeRef: setDragRef, transform } = useDraggable({
        id: context + '-' + id,
        data: { itemId: id, context },
    });

    const { isOver, setNodeRef: setDropRef } = useDroppable({
        id: 'target-' + id,
        data: { itemId: id },
    });

    const setNodeRef = (node: HTMLElement | null) => {
        setDragRef(node);
        setDropRef(node);
    };

    const dnd_style = { transform: CSS.Translate.toString(transform) };
    const name = item?.name ?? id;
    const description = item?.description ?? 'An indescribable item.';
    const canPickup = item?.canPickup ?? false;

    return (
        <span
            className={clsx(style.item, {
                [style.pickable]: canPickup,
                [style.over]: isOver,
                [style.inventoryItem]: context === 'inventory',
            })}
            title={description}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={dnd_style}
            onMouseEnter={() => setHoveredItem(id)}
            onMouseLeave={() => setHoveredItem(null)}
        >
            {name}
        </span>
    );
};
