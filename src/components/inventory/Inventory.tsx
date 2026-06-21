import style from './Inventory.module.css';
import { useDroppable } from '@dnd-kit/core';
import { clsx } from 'clsx';
import { useGameStore } from '@/utils/useGameStore';
import { Item } from '../item/Item';

export const Inventory = () => {
    const inventory = useGameStore((state) => state.inventory);
    const { isOver, setNodeRef } = useDroppable({ id: 'inventory' });

    return (
        <div className={style.inventory}>
            <h2>Your inventory:</h2>
            <div
                className={clsx(style.items, { [style.over]: isOver })}
                ref={setNodeRef}
            >
                {Array.from(inventory).map((itemId) => (
                    <Item context='inventory' key={itemId} id={itemId} />
                ))}
            </div>
        </div>
    );
};
