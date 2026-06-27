const CHARS = ' .,:;i1tfLCG08@';
const CHAR_ASPECT = 0.45;

const GAUSSIAN: number[] = [
    1 / 16, 2 / 16, 1 / 16,
    2 / 16, 4 / 16, 2 / 16,
    1 / 16, 2 / 16, 1 / 16,
];
const SOBEL_X: number[] = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
const SOBEL_Y: number[] = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

function convolve(src: Float32Array, w: number, h: number, kernel: number[]): Float32Array {
    const out = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let sum = 0;
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const sx = Math.max(0, Math.min(w - 1, x + kx));
                    const sy = Math.max(0, Math.min(h - 1, y + ky));
                    sum += src[sy * w + sx] * kernel[(ky + 1) * 3 + (kx + 1)];
                }
            }
            out[y * w + x] = sum;
        }
    }
    return out;
}

function histogramEqualize(lum: Float32Array): Float32Array {
    const n = lum.length;
    const hist = new Array(256).fill(0);
    for (let i = 0; i < n; i++) hist[Math.round(lum[i])]++;

    const cdf = new Array(256);
    cdf[0] = hist[0];
    for (let i = 1; i < 256; i++) cdf[i] = cdf[i - 1] + hist[i];
    const cdfMin = cdf.find((v) => v > 0) ?? 0;

    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        const b = Math.round(Math.max(0, Math.min(255, lum[i])));
        out[i] = ((cdf[b] - cdfMin) / (n - cdfMin)) * 255;
    }
    return out;
}

function applyGamma(lum: Float32Array, gamma: number): Float32Array {
    const out = new Float32Array(lum.length);
    for (let i = 0; i < lum.length; i++) {
        out[i] = 255 * Math.pow(Math.max(0, lum[i]) / 255, gamma);
    }
    return out;
}

function nonMaxSuppression(
    mag: Float32Array,
    gx: Float32Array,
    gy: Float32Array,
    w: number,
    h: number,
): Float32Array {
    const out = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            const m = mag[idx];
            if (m === 0) continue;

            let a = Math.atan2(gy[idx], gx[idx]) % Math.PI;
            if (a < 0) a += Math.PI;
            const deg = (a * 180) / Math.PI;

            let n1x: number, n1y: number, n2x: number, n2y: number;
            if (deg < 22.5 || deg >= 157.5) {
                [n1x, n1y, n2x, n2y] = [x - 1, y, x + 1, y];
            } else if (deg < 67.5) {
                [n1x, n1y, n2x, n2y] = [x + 1, y + 1, x - 1, y - 1];
            } else if (deg < 112.5) {
                [n1x, n1y, n2x, n2y] = [x, y - 1, x, y + 1];
            } else {
                [n1x, n1y, n2x, n2y] = [x - 1, y + 1, x + 1, y - 1];
            }

            const get = (nx: number, ny: number) =>
                nx >= 0 && nx < w && ny >= 0 && ny < h ? mag[ny * w + nx] : 0;

            if (m >= get(n1x, n1y) && m >= get(n2x, n2y)) out[idx] = m;
        }
    }
    return out;
}

function edgeChar(gxVal: number, gyVal: number): string {
    let a = Math.atan2(gyVal, gxVal) % Math.PI;
    if (a < 0) a += Math.PI;
    const deg = (a * 180) / Math.PI;
    if (deg < 22.5 || deg >= 157.5) return '|';
    if (deg < 67.5) return '\\';
    if (deg < 112.5) return '-';
    return '/';
}

export interface AsciiOptions {
    width: number;
    edgeThreshold: number;
    gamma: number;
}

export function imageToAscii(img: HTMLImageElement, options: AsciiOptions): string {
    const { width, edgeThreshold, gamma } = options;
    const height = Math.round((img.naturalHeight / img.naturalWidth) * width * CHAR_ASPECT);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);

    const lum = new Float32Array(width * height);
    for (let i = 0; i < lum.length; i++) {
        const p = i * 4;
        lum[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
    }

    const equalized = histogramEqualize(lum);
    const blurred = convolve(equalized, width, height, GAUSSIAN);
    const gx = convolve(blurred, width, height, SOBEL_X);
    const gy = convolve(blurred, width, height, SOBEL_Y);

    const mag = new Float32Array(width * height);
    for (let i = 0; i < mag.length; i++) mag[i] = Math.sqrt(gx[i] ** 2 + gy[i] ** 2);

    const edges = nonMaxSuppression(mag, gx, gy, width, height);
    const toned = applyGamma(equalized, gamma);

    let result = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            if (edges[idx] > edgeThreshold) {
                result += edgeChar(gx[idx], gy[idx]);
            } else {
                const b = Math.min(255, Math.max(0, toned[idx]));
                result += CHARS[Math.round((b / 255) * (CHARS.length - 1))];
            }
        }
        result += '\n';
    }
    return result;
}
