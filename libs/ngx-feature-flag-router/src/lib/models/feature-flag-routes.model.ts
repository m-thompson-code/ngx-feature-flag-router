import { LoadChildren, Route } from '@angular/router';
import { Observable } from 'rxjs';

// START_A14_CODE
// Code wrapped with `START_A14_CODE` and `END_A14_CODE`
// Will only be available for Angualr 14+
// END_A14_CODE

// START_A14_CODE
export type LoadComponent = NonNullable<Route['loadComponent']>;
// END_A14_CODE

export type FeatureFlag = () => boolean | Observable<boolean>;

export interface NoFeatureFlagProperties {
    featureFlag?: never;
    featureFlagPath?: never;
    alternativeLoadChildren?: never;
    // START_A14_CODE
    alternativeLoadComponent?: never;
    // END_A14_CODE
}

/**
 * Used to handle `UrlMatcher` logic so that it works with `featureFlagPath`
 */
export interface HasPathProperties {
    path?: string;
    featureFlagPath?: string;
    pathMatch?: string;
}

/**
 * `FeatureFlagRoute` extends `Route`
 *
 * All properties are the same as `Route` except that `loadChildren` is required instead of optional, and there are extra properties:
 * 1. alternativeLoadChildren
 * 2. featureFlag
 *
 * When using `FeatureFlagRoute` to navigate, `featureFlag` determines
 * if `loadChildren` or `alternativeLoadChildren` is used when lazy loading module for navigation
 *
 * If `featureFlag`'s latest value is `false`, `loadChildren` is used,
 * and if `featureFlag`'s latest value is `true`, `alternativeLoadChildren` is used instead.
 */
export type FeatureFlagRoute = Route & {
    children?: FeatureFlagRoutes;

    /**
     * Used to determine if navigation to this route should use `loadChildren` or `alternativeLoadChildren`
     * to lazy-load child routes.
     *
     * If `featureFlag`'s latest value is `false`, `loadChildren` is used,
     * and if `featureFlag`'s latest value is `true`, `alternativeLoadChildren` is used instead.
     */
    featureFlag: FeatureFlag;
} & (
        | {
              /**
               * An object specifying lazy-loaded child routes.
               *
               * if `alternativeLoadChildren` and `featureFlag` are also defined,
               * `loadChildren` will be used to lazy-load child routes when `featureFlag`'s latest value is `false`
               */
              loadChildren: LoadChildren;
              /**
               * An object specifying lazy-loaded child routes.
               *
               * if `loadChildren` and `featureFlag` are also defined,
               * `alternativeLoadChildren` will be used to lazy-load child routes when `featureFlag`'s latest value is `true`
               */
              alternativeLoadChildren: LoadChildren;
              // START_A14_CODE
              /**
               * // TODO:
               */
              loadComponent?: never;
              /**
               * // TODO:
               */
              alternativeLoadComponent?: never;
              // END_A14_CODE
          }
        // START_A14_CODE
        | {
              /**
               * // TODO:
               */
              loadComponent: LoadComponent;
              /**
               * // TODO:
               */
              alternativeLoadComponent: LoadComponent;

              /**
               * // TODO:
               */
              loadChildren?: never;
              /**
               * // TODO:
               */
              alternativeLoadChildren?: never;
          }
    );
    // END_A14_CODE

/**
 * Same type as FeatureFlagRoutes, but instead of Route it uses PatchedRoute
 * to allow for easier type checks
 *
 * @see `PatchedRoute`
 */
export type FeatureFlagPatchedRoutes = (FeatureFlagRoute | PatchedRoute)[];

/**
 * `Route` interface but with added optional never properties
 * to allow checking against `FeatureFlagRoute` properties.
 *
 * Also assumes that children can be FeatureFlagRoutes and not just Routes.
 */
export type PatchedRoute = Omit<Route, 'children'> &
    NoFeatureFlagProperties & {
        children?: FeatureFlagPatchedRoutes;
        loadChildren?: LoadChildren;
    };

export type ProcessedFeatureFlagProperties =
    | 'children'
    | 'featureFlag'
    // START_A14_CODE
    | 'loadComponent'
    | 'alternativeLoadComponent'
    // END_A14_CODE
    | 'loadChildren'
    | 'alternativeLoadChildren';

export type ProcessedFeatureFlagRoute = Omit<FeatureFlagRoute, ProcessedFeatureFlagProperties> & {
    children?: ProcessedFeatureFlagRoute[];
    loadChildren?: LoadChildren;
    // START_A14_CODE
    loadComponent?: LoadComponent;
    // END_A14_CODE
} & (
        | {
              /**
               * Value used instead of `path` to deal with empty path issue
               *
               * Value is optional since not all `Routes` have `path` property and instead of `UrlMatcher`
               */
              featureFlagPath?: string;
              path?: never;
          }
        | {
              featureFlagPath?: never;
              path?: string;
          }
    );

/**
 * Array of `FeatureFlagRoute` or `Route`
 *
 * `FeatureFlagRoute` properties are the same as `Route` except that `loadChildren` is required instead of optional,
 * and there are extra properties:
 * 1. featureFlag
 * 2. alternativeLoadChildren
 * 3. alternativeLoadComponent (Only available for Angular 14+)
 *
 * These properties are used to allow for conditionally lazy-loading an alternative `NgModule` than `loadChildren`
 * Outside of these two properties, `FeatureFlagRoute` serve the same purpose and functionality of `Route`
 *
 * A configuration object that defines a single route.
 * A set of routes are collected in a Routes array to define a Router configuration.
 * The router attempts to match segments of a given URL against each route,
 * using the configuration options defined in this object.
 *
 * @see `FeatureFlagRoute`
 * @see `Route`
 * @see `Routes`
 */
export type FeatureFlagRoutes = (FeatureFlagRoute | Route)[];
