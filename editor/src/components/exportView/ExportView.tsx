import { useState } from 'react';
import { useEditorStore } from '../../utils/useEditorStore';
import { exportGame, downloadGame } from '../../utils/exportGame';
import { Field, SelectField } from '../ui/Field';
import style from './ExportView.module.css';

export const ExportView = () => {
    const { project, setProjectName, setProjectId, setStartLocation } = useEditorStore();
    const [copied, setCopied] = useState(false);

    const json = exportGame(project);
    const locationOptions = project.locations.map((l) => ({ value: l.id, label: l.name || l.id }));

    const copy = () => {
        navigator.clipboard.writeText(json).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };

    return (
        <div className={style.view}>
            <div className={style.settings}>
                <h2 className={style.heading}>Export</h2>
                <div className={style.row}>
                    <Field label='Game name' value={project.name} onChange={setProjectName} placeholder='My Adventure' />
                    <Field label='Game ID' value={project.id} onChange={setProjectId} placeholder='my_adventure' mono />
                </div>
                <SelectField
                    label='Starting location'
                    value={project.startLocationId}
                    options={locationOptions}
                    onChange={setStartLocation}
                />
                <div className={style.actions}>
                    <button className={style.btn} onClick={copy}>{copied ? 'Copied!' : 'Copy JSON'}</button>
                    <button className={style.btnPrimary} onClick={() => downloadGame(project)}>Download {project.id}.json</button>
                </div>
            </div>
            <pre className={style.preview}>{json}</pre>
        </div>
    );
};
