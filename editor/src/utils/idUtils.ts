export function slugify(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

export function uniqueId(base: string, takenIds: string[]): string {
    if (!takenIds.includes(base)) return base;
    let n = 2;
    while (takenIds.includes(`${base}_${n}`)) n++;
    return `${base}_${n}`;
}
