const EGA: [number, number, number][] = [
    [0, 0, 0], [0, 0, 170], [0, 170, 0], [0, 170, 170],
    [170, 0, 0], [170, 0, 170], [170, 85, 0], [170, 170, 170],
    [85, 85, 85], [85, 85, 255], [85, 255, 85], [85, 255, 255],
    [255, 85, 85], [255, 85, 255], [255, 255, 85], [255, 255, 255],
];

export type ColourMode = 'full' | '256' | '16';

export interface RetroOptions {
    width: number;
    colours: ColourMode;
    dither: boolean;
    scale: number;
}

function nearestEGA(r: number, g: number, b: number): [number, number, number] {
    let best = EGA[0];
    let bestDist = Infinity;
    for (const c of EGA) {
        const d = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
        if (d < bestDist) { bestDist = d; best = c; }
    }
    return best;
}

function quantize(r: number, g: number, b: number, mode: ColourMode): [number, number, number] {
    if (mode === 'full') return [r, g, b];
    if (mode === '16') return nearestEGA(r, g, b);
    // RGB332: 8 red × 8 green × 4 blue = 256 colours
    return [
        Math.round(r / 255 * 7) * Math.round(255 / 7),
        Math.round(g / 255 * 7) * Math.round(255 / 7),
        Math.round(b / 255 * 3) * 85,
    ];
}

export function imageToRetro(img: HTMLImageElement, options: RetroOptions): HTMLCanvasElement {
    const { width, colours, dither, scale } = options;
    const height = Math.round(img.naturalHeight / img.naturalWidth * width);

    const src = document.createElement('canvas');
    src.width = width;
    src.height = height;
    const ctx = src.getContext('2d')!;
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const buf = new Float32Array(imageData.data);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const [nr, ng, nb] = quantize(
                Math.max(0, Math.min(255, buf[i])),
                Math.max(0, Math.min(255, buf[i + 1])),
                Math.max(0, Math.min(255, buf[i + 2])),
                colours,
            );

            if (dither) {
                const er = buf[i] - nr;
                const eg = buf[i + 1] - ng;
                const eb = buf[i + 2] - nb;
                const spread = (dx: number, dy: number, f: number) => {
                    const nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < width && ny < height) {
                        const ni = (ny * width + nx) * 4;
                        buf[ni] += er * f;
                        buf[ni + 1] += eg * f;
                        buf[ni + 2] += eb * f;
                    }
                };
                spread(1, 0, 7 / 16);
                spread(-1, 1, 3 / 16);
                spread(0, 1, 5 / 16);
                spread(1, 1, 1 / 16);
            }

            imageData.data[i] = nr;
            imageData.data[i + 1] = ng;
            imageData.data[i + 2] = nb;
            imageData.data[i + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    if (scale === 1) return src;

    const out = document.createElement('canvas');
    out.width = width * scale;
    out.height = height * scale;
    const octx = out.getContext('2d')!;
    octx.imageSmoothingEnabled = false;
    octx.drawImage(src, 0, 0, out.width, out.height);
    return out;
}
