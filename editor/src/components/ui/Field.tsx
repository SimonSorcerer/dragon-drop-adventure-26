import style from './Field.module.css';

interface FieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    multiline?: boolean;
    placeholder?: string;
    mono?: boolean;
}

export const Field = ({ label, value, onChange, multiline, placeholder, mono }: FieldProps) => (
    <label className={style.field}>
        <span className={style.label}>{label}</span>
        {multiline ? (
            <textarea
                className={`${style.input} ${mono ? style.mono : ''}`}
                value={value}
                rows={4}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        ) : (
            <input
                type='text'
                className={`${style.input} ${mono ? style.mono : ''}`}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        )}
    </label>
);

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
