import { useRef, useState } from 'react';
import { imageToAscii, type AsciiOptions } from '../../utils/imageToAscii';
import style from './AsciiConverter.module.css';

const DEFAULTS: AsciiOptions = { width: 80, edgeThreshold: 30, gamma: 1.0 };

export const AsciiConverter = () => {
    const [ascii, setAscii] = useState('');
    const [options, setOptions] = useState<AsciiOptions>(DEFAULTS);
    const [previewSrc, setPreviewSrc] = useState('');
    const [copied, setCopied] = useState(false);
    const loadedImg = useRef<HTMLImageElement | null>(null);

    const run = (opts: AsciiOptions) => {
        if (loadedImg.current) setAscii(imageToAscii(loadedImg.current, opts));
    };

    const update = (patch: Partial<AsciiOptions>) => {
        const next = { ...options, ...patch };
        setOptions(next);
        run(next);
    };

    const handleFile = (file: File) => {
        const url = URL.createObjectURL(file);
        setPreviewSrc(url);
        const img = new Image();
        img.onload = () => {
            loadedImg.current = img;
            run(options);
        };
        img.src = url;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith('image/')) handleFile(file);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(ascii).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };

    return (
        <div className={style.page}>
            <h1 className={style.title}>ASCII Converter</h1>

            <div
                className={style.dropZone}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('fileInput')?.click()}
            >
                {previewSrc ? (
                    <img className={style.preview} src={previewSrc} alt='Source' />
                ) : (
                    <span className={style.dropHint}>Drop image here or click to browse</span>
                )}
            </div>

            <input
                id='fileInput'
                type='file'
                accept='image/*'
                className={style.fileInput}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />

            <div className={style.controls}>
                <Slider
                    label='Width'
                    value={options.width}
                    unit=' chars'
                    min={40}
                    max={320}
                    step={20}
                    onChange={(v) => update({ width: v })}
                />
                <Slider
                    label='Edge threshold'
                    value={options.edgeThreshold}
                    min={5}
                    max={100}
                    step={1}
                    onChange={(v) => update({ edgeThreshold: v })}
                />
                <Slider
                    label='Gamma'
                    value={options.gamma}
                    min={0.3}
                    max={2.5}
                    step={0.1}
                    format={(v) => v.toFixed(1)}
                    onChange={(v) => update({ gamma: v })}
                />
            </div>

            {ascii && (
                <div className={style.outputSection}>
                    <div className={style.outputHeader}>
                        <span>Output</span>
                        <button className={style.copyBtn} onClick={copyToClipboard}>
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <pre className={style.output}>{ascii}</pre>
                </div>
            )}
        </div>
    );
};

interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit?: string;
    format?: (v: number) => string;
    onChange: (v: number) => void;
}

const Slider = ({ label, value, min, max, step, unit = '', format, onChange }: SliderProps) => (
    <label className={style.label}>
        <span className={style.labelText}>
            {label}: <strong>{format ? format(value) : value}{unit}</strong>
        </span>
        <input
            type='range'
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={style.slider}
        />
    </label>
);
