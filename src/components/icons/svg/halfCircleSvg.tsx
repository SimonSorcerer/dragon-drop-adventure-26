interface SvgProps {
    className?: string;
    title?: string;
}

export const HalfCircleSvg = ({
    className,
    title = 'Toggle dark mode',
}: SvgProps) => (
    <svg
        className={className}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        role='img'
        aria-label={title}
    >
        <title>{title}</title>
        <path
            fill='currentColor'
            d='M12,0C5.38,0,0,5.38,0,12s5.38,12,12,12,12-5.38,12-12S18.62,0,12,0Zm0,22V2c5.51,0,10,4.49,10,10s-4.49,10-10,10Z'
        />
    </svg>
);
