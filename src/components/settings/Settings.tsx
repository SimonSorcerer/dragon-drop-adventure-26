import { useRef } from 'react';
import style from './Settings.module.css';
import { Icon } from '../icons/Icon';
import { useGameStore } from '@utils/useGameStore';
import { useNavigation } from '@utils/useNavigation';
import type { GameDefinition } from '@utils/useGameStore';

export const Settings = () => {
    const initGame = useGameStore((state) => state.initGame);
    const addLogEntry = useGameStore((state) => state.addLogEntry);
    const navigate = useNavigation();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        file.text()
            .then((text) => {
                const definition = JSON.parse(text) as GameDefinition;
                if (
                    !Array.isArray(definition.locations) ||
                    !Array.isArray(definition.interactions) ||
                    !definition.startLocationId
                ) {
                    addLogEntry({ prefix: 'Load failed', text: 'Invalid game file: missing locations, interactions, or start location.' });
                    return;
                }
                initGame(definition);
                navigate(definition.startLocationId);
            })
            .catch(() => {
                addLogEntry({ prefix: 'Load failed', text: 'Could not read game file — invalid JSON.' });
            });
        e.target.value = '';
    };

    return (
        <div className={style.wrapper}>
            <button
                className={style.loadBtn}
                onClick={() => inputRef.current?.click()}
            >
                Load JSON
            </button>
            <input
                ref={inputRef}
                type='file'
                accept='.json'
                onChange={handleLoad}
                hidden
            />
            <Icon type='dark-mode' />
            <Icon type='text-size' />
            <Icon type='playback' />
        </div>
    );
};
