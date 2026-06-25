import type { Location } from '@type/Location';

export function resolveDescription(
    location: Location,
    flags: Record<string, unknown>,
): string {
    if (!location.descriptionVariants) return location.description;

    for (const variant of location.descriptionVariants) {
        const conditions = Array.isArray(variant.when)
            ? variant.when
            : [variant.when];
        if (conditions.every((flag) => Boolean(flags[flag]))) {
            return variant.description;
        }
    }

    return location.description;
}
