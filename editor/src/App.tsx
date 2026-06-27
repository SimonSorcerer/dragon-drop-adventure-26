import { useState } from 'react';
import { AsciiConverter } from './components/asciiConverter/AsciiConverter';
import { RetroConverter } from './components/retroConverter/RetroConverter';
import style from './App.module.css';

type Tab = 'ascii' | 'retro';

export const App = () => {
    const [tab, setTab] = useState<Tab>('ascii');
    return (
        <div>
            <nav className={style.nav}>
                <button
                    className={tab === 'ascii' ? style.tabActive : style.tab}
                    onClick={() => setTab('ascii')}
                >
                    ASCII
                </button>
                <button
                    className={tab === 'retro' ? style.tabActive : style.tab}
                    onClick={() => setTab('retro')}
                >
                    Retro
                </button>
            </nav>
            {tab === 'ascii' ? <AsciiConverter /> : <RetroConverter />}
        </div>
    );
};
