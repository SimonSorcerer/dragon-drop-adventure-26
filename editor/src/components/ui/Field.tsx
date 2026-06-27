import { useEffect, useRef } from 'react';
import style from './Field.module.css';

interface FieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    onBlur?: (v: string) => void;
    multiline?: boolean;
    placeholder?: string;
    mono?: boolean;
    storageKey?: string;
}

export const Field = ({ label, value, onChange, onBlur, multiline, placeholder, mono, storageKey }: FieldProps) => (
    <label className={style.field}>
        <span className={style.label}>{label}</span>
        {multiline ? (
            <ResizableTextarea
                className={`${style.input} ${mono ? style.mono : ''}`}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                storageKey={storageKey}
            />
        ) : (
            <input
                type='text'
                className={`${style.input} ${mono ? style.mono : ''}`}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                onBlur={(e) => onBlur?.(e.target.value)}
            />
        )}
    </label>
);

interface TextareaProps {
    className: string;
    value: string;
    placeholder?: string;
    onChange: (v: string) => void;
    onBlur?: (v: string) => void;
    storageKey?: string;
}

const ResizableTextarea = ({ className, value, placeholder, onChange, onBlur, storageKey }: TextareaProps) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (storageKey && ref.current) {
            const saved = localStorage.getItem(`field-height:${storageKey}`);
            if (saved) ref.current.style.height = saved;
        }
    }, [storageKey]);

    const handleMouseUp = () => {
        if (storageKey && ref.current) {
            localStorage.setItem(`field-height:${storageKey}`, `${ref.current.offsetHeight}px`);
        }
    };

    return (
        <textarea
            ref={ref}
            className={className}
            value={value}
            rows={7}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur?.(e.target.value)}
            onMouseUp={handleMouseUp}
        />
    );
};

interface SelectFieldProps {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
}

export const SelectField = ({ label, value, options, onChange }: SelectFieldProps) => (
    <label className={style.field}>
        <span className={style.label}>{label}</span>
        <select className={style.input} value={value} onChange={(e) => onChange(e.target.value)}>
            <option value=''>— select —</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    </label>
);

interface ToggleProps {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
}

export const Toggle = ({ label, value, onChange }: ToggleProps) => (
    <label className={style.toggle}>
        <input type='checkbox' checked={value} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
    </label>
);
