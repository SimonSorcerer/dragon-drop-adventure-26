import styles from './Photo.module.css';

interface PhotoProps {
    src: string;
}

export const Photo = ({ src }: PhotoProps) => {
    return (
        <div>
            <img className={styles.photo} src={src} alt='Location' />
        </div>
    );
};
