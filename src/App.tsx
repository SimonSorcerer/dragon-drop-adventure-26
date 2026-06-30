import './App.css';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useEffect } from 'react';
import { Game } from './components/Game';
import { useGameStore } from './utils/useGameStore';
import { findInteraction } from './assets/interactions/interactions';
import { useNavigation } from './utils/useNavigation';

function App() {
    const pickUpItem = useGameStore((state) => state.pickUpItem);
    const addLogEntry = useGameStore((state) => state.addLogEntry);
    const applyEffect = useGameStore((state) => state.applyEffect);
    const interactions = useGameStore((state) => state.interactions);
    const items = useGameStore((state) => state.items);
    const navigate = useNavigation();

    useEffect(() => {
        navigate(useGameStore.getState().currentLocationId);
    }, [navigate]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;
        if (!over) return;

        const itemId = active.data.current?.itemId as string;
        const context = active.data.current?.context as string;

        if (over.id === 'inventory') {
            if (context === 'location' && items[itemId]?.canPickup) {
                pickUpItem(itemId);
            }
        } else if (
            typeof over.id === 'string' &&
            over.id.startsWith('target-')
        ) {
            const targetId = over.id.slice('target-'.length);
            if (targetId !== itemId) {
                const interaction = findInteraction(itemId, targetId, interactions, items);
                addLogEntry({
                    prefix: interaction.prefix,
                    text: interaction.text,
                });
                interaction.effects?.forEach((effect) => applyEffect(effect));
            }
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <Game />
        </DndContext>
    );
}

export default App;
