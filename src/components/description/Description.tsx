import { clsx } from 'clsx';
import { useGameStore } from '@/utils/useGameStore';
import style from './Description.module.css';

export const Description = () => {
    const log = useGameStore((state) => state.log);
    const reversed = [...log].reverse();

    return (
        <div className={style.description}>
            {reversed.map((entry, i) => {
                const originalIndex = log.length - 1 - i;
                return (
                    <div
                        key={originalIndex}
                        className={clsx(style.record, { [style.old]: i > 0 })}
                    >
                        <div className={style.message}>
                            {entry.prefix && (
                                <span className={style.prefix}>{entry.prefix}: </span>
                            )}
                            {entry.text}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
