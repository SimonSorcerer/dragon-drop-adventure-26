import style from './ReadOnlyId.module.css';

interface Props {
    id: string;
    error?: string;
}

export const ReadOnlyId = ({ id, error }: Props) => (
    <div className={style.idField}>
        <span className={style.idLabel}>ID</span>
        <span className={`${style.idValue} ${error ? style.idError : ''}`}>
            {id}
        </span>
        {error && <span className={style.idErrorMsg}>{error}</span>}
    </div>
);
