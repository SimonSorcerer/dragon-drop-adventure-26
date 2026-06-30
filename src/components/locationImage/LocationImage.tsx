import { useEffect, useState } from 'react';
import { useGameStore } from '@utils/useGameStore';
import type { LocationImages } from '@type/Location';
import style from './LocationImage.module.css';

type ImageState = keyof LocationImages;

const ORDER: ImageState[] = ['ascii', 'retro', 'modern'];

function availableStates(images: LocationImages): ImageState[] {
    return ORDER.filter((s) => images[s]);
}

function firstAvailable(images: LocationImages): ImageState | null {
    return availableStates(images)[0] ?? null;
}

export const LocationImage = () => {
    const currentLocationId = useGameStore((state) => state.currentLocationId);
    const images = useGameStore(
        (state) => state.locations[state.currentLocationId]?.images ?? {},
    );
    const locationName = useGameStore(
        (state) => state.locations[state.currentLocationId]?.name ?? '',
    );
    const available = availableStates(images);

    const [active, setActive] = useState<ImageState | null>(() =>
        firstAvailable(images),
    );

    useEffect(() => {
        setActive(firstAvailable(images));
    }, [currentLocationId]);

    if (available.length === 0 || !active) return null;

    const cycleNext = () => {
        const idx = available.indexOf(active);
        setActive(available[(idx + 1) % available.length]);
    };

    const nextLabel: Record<ImageState, string> = {
        ascii: 'View ASCII',
        retro: 'View 1995 photo',
        modern: 'View modern photo',
    };
    const nextState =
        available[(available.indexOf(active) + 1) % available.length];

    return (
        <div className={style.panel}>
            {active === 'ascii' && (
                <pre
                    className={style.ascii}
                    role='img'
                    aria-label={`${locationName} — ASCII`}
                >
                    {images.ascii}
                </pre>
            )}
            {(active === 'retro' || active === 'modern') && (
                <img
                    className={active === 'retro' ? style.retro : style.image}
                    src={images[active]}
                    alt={`${locationName} — ${active === 'retro' ? '1995' : 'modern'}`}
                />
            )}
            {available.length > 1 && (
                <button
                    className={style.toggle}
                    onClick={cycleNext}
                    aria-label={nextLabel[nextState]}
                    title={nextLabel[nextState]}
                >
                    {nextLabel[nextState]}
                </button>
            )}
        </div>
    );
};
