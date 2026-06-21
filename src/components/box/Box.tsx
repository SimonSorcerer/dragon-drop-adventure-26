import style from './Box.module.css';

interface BoxProps {
    className?: string;
    placeholder?: string;
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
}

export const Box = ({ children, className, placeholder, ref }: BoxProps) => {
    return (
        <div className={`${style.box} ${className}`} ref={ref}>
            {placeholder && (
                <div className={style.placeholder}>{placeholder}</div>
            )}
            {children}
        </div>
    );
};
