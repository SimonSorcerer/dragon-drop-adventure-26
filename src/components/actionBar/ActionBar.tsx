import { useDndMonitor } from '@dnd-kit/core';
import { useState } from 'react';
import { items } from '@assets/items/items';
import { locations } from '@assets/locations/locations';
import { useGameStore } from '@/utils/useGameStore';
import style from './ActionBar.module.css';

export const ActionBar = () => {
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);
    const hoveredInteractable = useGameStore((state) => state.hoveredInteractable);

    useDndMonitor({
        onDragStart(event) {
            setActiveItemId(event.active.data.current?.itemId ?? null);
            setOverId(null);
        },
        onDragOver(event) {
            setOverId(event.over?.id?.toString() ?? null);
        },
        onDragEnd() {
            setActiveItemId(null);
            setOverId(null);
        },
        onDragCancel() {
            setActiveItemId(null);
            setOverId(null);
        },
    });

    let message = '';
    if (activeItemId) {
        const itemName = items[activeItemId]?.name ?? activeItemId;
        if (overId === 'inventory') {
            message = `Pick up ${itemName}`;
        } else if (overId?.startsWith('target-')) {
            const targetId = overId.slice('target-'.length);
            const targetName = items[targetId]?.name ?? targetId;
            message = `Use ${itemName} with ${targetName}`;
        } else {
            message = `Use ${itemName} with ...`;
        }
    } else if (hoveredInteractable?.type === 'item') {
        message = `Look at ${items[hoveredInteractable.id]?.name ?? hoveredInteractable.id}`;
    } else if (hoveredInteractable?.type === 'exit') {
        message = `Go to ${locations[hoveredInteractable.destination]?.name ?? hoveredInteractable.destination}`;
    }

    return <div className={style.console}>{message}</div>;
};
