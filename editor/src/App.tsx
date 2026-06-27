import { useState, Fragment } from 'react';
import { AsciiConverter } from './components/asciiConverter/AsciiConverter';
import { RetroConverter } from './components/retroConverter/RetroConverter';
import { LocationsView } from './components/locationsView/LocationsView';
import { InteractionsView } from './components/interactionsView/InteractionsView';
import { ExportView } from './components/exportView/ExportView';
import style from './App.module.css';

type Tab = 'locations' | 'interactions' | 'export' | 'ascii' | 'retro';

const TABS: { id: Tab; label: string }[] = [
    { id: 'locations', label: 'Locations' },
    { id: 'interactions', label: 'Interactions' },
    { id: 'export', label: 'Export' },
    { id: 'ascii', label: 'ASCII' },
    { id: 'retro', label: 'Retro' },
];

export const App = () => {
    const [tab, setTab] = useState<Tab>('locations');
    return (
        <div className={style.app}>
            <nav className={style.nav}>
                {TABS.map((t, i) => (
                    <Fragment key={t.id}>
                        {i === 3 && <div className={style.sep} />}
                        <button
                            className={tab === t.id ? style.tabActive : style.tab}
                            onClick={() => setTab(t.id)}
                        >
                            {t.label}
                        </button>
                    </Fragment>
                ))}
            </nav>
            <main className={style.main}>
                {tab === 'locations' && <LocationsView />}
                {tab === 'interactions' && <InteractionsView />}
                {tab === 'export' && <ExportView />}
                {tab === 'ascii' && <AsciiConverter />}
                {tab === 'retro' && <RetroConverter />}
            </main>
        </div>
    );
};
