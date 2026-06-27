import { useRef, useState } from 'react';
import { imageToRetro, type ColourMode, type RetroOptions } from '../../utils/imageToRetro';
import style from './RetroConverter.module.css';

const PRESETS = [80, 160, 320, 640];
const DEFAULTS: RetroOptions = { width: 320, colours: '256', dither: true, scale: 1 };

export const RetroConverter = () => {
    const [options, setOptions] = useState<RetroOptions>(DEFAULTS);
    const [previewSrc, setPreviewSrc] = useState('');
    const [outputSrc, setOutputSrc] = useState('');
    const loadedImg = useRef<HTMLImageElement | null>(null);

    const run = (opts: RetroOptions) => {
        if (!loadedImg.current) return;
        const result = imageToRetro(loadedImg.current, opts);
        setOutputSrc(result.toDataURL('image/png'));
    };

    const update = (patch: Partial<RetroOptions>) => {
        const next = { ...options, ...patch };
        setOptions(next);
        run(next);
    };

    const handleFile = (file: File) => {
        const url = URL.createObjectURL(file);
        setPreviewSrc(url);
        const img = new Image();
        img.onload = () => { loadedImg.current = img; run(options); };
        img.src = url;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith('image/')) handleFile(file);
    };

    const download = () => {
        if (!outputSrc) return;
        const a = document.createElement('a');
        a.href = outputSrc;
        a.download = `retro-${options.width}px.png`;
        a.click();
    };

    return (
        <div className={style.page}>
            <h1 className={style.title}>Retro Converter</h1>

            <div
                className={style.dropZone}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('retroFileInput')?.click()}
            >
                {previewSrc ? (
                    <img className={style.sourcePreview} src={previewSrc} alt='Source' />
                ) : (
                    <span className={style.dropHint}>Drop image here or click to browse</span>
                )}
            </div>

            <input
                id='retroFileInput'
                type='file'
                accept='image/*'
                className={style.fileInput}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />

            <div className={style.controls}>
                <div className={style.controlRow}>
                    <span className={style.controlLabel}>Resolution</span>
                    <div className={style.btnGroup}>
                        {PRESETS.map((w) => (
                            <button
                                key={w}
                                className={options.width === w ? style.btnActive : style.btn}
                                onClick={() => update({ width: w })}
                            >
                                {w}px
                            </button>
                        ))}
                    </div>
                </div>

                <div className={style.controlRow}>
                    <span className={style.controlLabel}>Colours</span>
                    <div className={style.btnGroup}>
                        {(['full', '256', '16'] as ColourMode[]).map((c) => (
                            <button
                                key={c}
                                className={options.colours === c ? style.btnActive : style.btn}
                                onClick={() => update({ colours: c })}
                            >
                                {c === 'full' ? 'Full' : c === '256' ? 'VGA 256' : 'EGA 16'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={style.controlRow}>
                    <span className={style.controlLabel}>Dithering</span>
                    <div className={style.btnGroup}>
                        <button
                            className={options.dither ? style.btnActive : style.btn}
                            onClick={() => update({ dither: true })}
                        >On</button>
                        <button
                            className={!options.dither ? style.btnActive : style.btn}
                            onClick={() => update({ dither: false })}
                        >Off</button>
                    </div>
                </div>

                <div className={style.controlRow}>
                    <span className={style.controlLabel}>Scale: {options.scale}×</span>
                    <input
                        type='range'
                        min={1}
                        max={8}
                        step={1}
                        value={options.scale}
                        onChange={(e) => update({ scale: Number(e.target.value) })}
                        className={style.slider}
                    />
                </div>
            </div>

            {outputSrc && (
                <div className={style.outputSection}>
                    <div className={style.outputHeader}>
                        <span>{options.width}px · {options.colours === 'full' ? 'Full colour' : options.colours === '256' ? 'VGA 256' : 'EGA 16'} · dither {options.dither ? 'on' : 'off'}</span>
                        <button className={style.downloadBtn} onClick={download}>Download PNG</button>
                    </div>
                    <img src={outputSrc} className={style.output} alt='Retro output' />
                </div>
            )}
        </div>
    );
};
