import { UrlMatchResult, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { PatchedRoute, ProcessedFeatureFlagRoute } from '../models';

/**
 * `defaultUrlMatcher` from
 * [`angular/packages/router/src/shared.ts`](https://github.com/angular/angular/blob/master/packages/router/src/shared.ts)
 *
 * Since angular doesn't export this function, here is a copy of it using version 13.2.x
 *
 * This is a known request since this can be useful for extended matcher's default behavior:
 * [github](https://github.com/angular/angular/issues/35928)
 *
 * Matches the route configuration (`route`) against the actual URL (`segments`).
 */
export function defaultUrlMatcher(
    segments: UrlSegment[],
    segmentGroup: UrlSegmentGroup,
    route: PatchedRoute | ProcessedFeatureFlagRoute,
): UrlMatchResult | null {
    // This part is changed,
    // default behavior is to assume that routes always have property `path` as string
    // to allow for UrlMatcher always run on navigate, path is set to `undefined` instead of empty string
    // Angular normally avoids using the UrlMatcher if path is empty string
    const parts = getRoutePath(route).split('/');

    // Extra exit early condition for handling if url is empty
    if (segments.length === 0 && parts.length === 1 && parts[0] === '') {
        return { consumed: segments.slice(0, parts.length), posParams: {} };
    }

    if (parts.length > segments.length) {
        // The actual URL is shorter than the config, no match
        return null;
    }

    if (route.pathMatch === 'full' && (segmentGroup.hasChildren() || parts.length < segments.length)) {
        // The config is longer than the actual URL but we are looking for a full match, return null
        return null;
    }

    const posParams: { [key: string]: UrlSegment } = {};

    // Check each config part against the actual URL
    for (let index = 0; index < parts.length; index++) {
        const part = parts[index];
        const segment = segments[index];
        const isParameter = part.startsWith(':');
        if (isParameter) {
            posParams[part.substring(1)] = segment;
        } else if (part !== segment.path) {
            // The actual URL part does not match the config, no match
            return null;
        }
    }

    return { consumed: segments.slice(0, parts.length), posParams };
}

/**
 * Get path of `Route`. Checks `path` property and `featureFlagPath` property.
 * If no path is found, returns empty string.
 */
export const getRoutePath = (route: PatchedRoute | ProcessedFeatureFlagRoute): string => {
    const path = route.path ?? route.featureFlagPath;

    if (!path) {
        return '';
    }

    return path;
};
