import style from './Icon.module.css';
import { HalfCircleSvg } from './svg/halfCircleSvg';
import { PlaybackSvg } from './svg/playbackSvg';
import { TextSizeSvg } from './svg/textSizeSvg';

interface IconProps {
    type: 'dark-mode' | 'playback' | 'text-size';
    className?: string;
}

const iconMap = {
    'dark-mode': HalfCircleSvg,
    playback: PlaybackSvg,
    'text-size': TextSizeSvg,
} as const;

export const Icon = ({ type, className }: IconProps) => {
    const IconComponent = iconMap[type];

    return <IconComponent className={`${style.icon} ${className || ''}`} />;
};
