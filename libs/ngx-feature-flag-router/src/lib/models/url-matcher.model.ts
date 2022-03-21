import { Route, UrlMatchResult, UrlSegment, UrlSegmentGroup } from '@angular/router';

/**
 * Angular 8 and 9 have the wrong return type for UrlMatcher.
 * jsdocs show UrlMatcher return type cannot be null yet it also shows returning null as its example:
 *
 * source: https://github.com/angular/angular/blob/8.0.x/packages/router/src/config.ts#L66
 * ```
 * export function htmlFiles(url: UrlSegment[]) {
 *   return url.length === 1 && url[0].path.endsWith('.html') ? ({consumed: url}) : null;
 * }
 *
 * export const routes = [{ matcher: htmlFiles, component: AnyComponent }];
 * ```
 *
 * This oversight is corrected in Angular 10:
 * source: https://github.com/angular/angular/blob/10.0.x/packages/router/src/config.ts#L64
 */
export type LegacyUrlMatcher = (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => UrlMatchResult;
export type ModernUrlMatcher = (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => UrlMatchResult | null;
