import { LoadChildrenCallback, Route, Routes } from '@angular/router';
import { Observable } from 'rxjs';

export type PatchedRoute = Omit<Route, 'children'> & {
    alternativeLoadChildren?: never;
    featureFlag?: never;
    children?: FeatureFlagRoutes;
};

/**
 * `FeatureFlagRoute` extends `Route`
 *
 * All properties are the same as `Route` except that `loadChildren` is required instead of optional
 *
 * When using `FeatureFlagRoute` to navigate, `featureFlag` determines
 * if `loadChildren` or `alternativeLoadChildren` is used when lazy loading module for navigation
 *
 * If `featureFlag`'s latest value is `false`, `loadChildren` is used,
 * and if `featureFlag`'s latest value is `true`, `alternativeLoadChildren` is used instead.
 */
export interface FeatureFlagRoute extends Route {
    children?: FeatureFlagRoutes;

    /**
     * An object specifying lazy-loaded child routes.
     *
     * if `alternativeLoadChildren` and `featureFlag` are also defined,
     * `loadChildren` will be used to lazy-load child routes when `featureFlag`'s latest value is `false`
     */
    loadChildren: LoadChildrenCallback;
    /**
     * An object specifying lazy-loaded child routes.
     *
     * if `loadChildren` and `featureFlag` are also defined,
     * `alternativeLoadChildren` will be used to lazy-load child routes when `featureFlag`'s latest value is `true`
     */
    alternativeLoadChildren: LoadChildrenCallback;
    /**
     * Used to determine if navigation to this route should use `loadChildren` or `alternativeLoadChildren`
     * to lazy-load child routes.
     *
     * If `featureFlag`'s latest value is `false`, `loadChildren` is used,
     * and if `featureFlag`'s latest value is `true`, `alternativeLoadChildren` is used instead.
     */
    featureFlag: () => boolean | Observable<boolean>;
}

/**
 * Array of `FeatureFlagRoute` or `Route`
 *
 * `FeatureFlagRoute` has all the same properties of `Route` and 2 other properties:
 *
 * 1. `featureFlag`
 * 2. `alternativeLoadChildren`
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
export type FeatureFlagRoutes = (FeatureFlagRoute | PatchedRoute)[];

/**
 * Service with method `getFeatureRoutes`
 *
 * Used to add addtional `ROUTES` to NgModule importing `FeatureFlagRouterModule`
 *
 * These `ROUTES` can use a Feature Flag to determine which NgModule to lazy load when navigating to a path
 */
export abstract class FeatureFlagRoutesService {
    /**
     * `getFeatureRoutes` is expected to return an Array of `FeatureFlagRoute` or `Route` (`NotFeatureFlagRoute`)
     *
     * These values will be appended to the beginning of the `ROUTES` used by NgModule importing `FeatureFlagRouterModule`
     *
     * This means that previous `ROUTES` may be overridden by the `ROUTES` returned by this method
     */
    abstract getFeatureRoutes(): FeatureFlagRoutes;
}

export abstract class FactoryService {
    // Fallback to the normal set of `ROUTES`
    abstract getRoutesFromFeatureFlagRoutes(featureFlagRoutes: FeatureFlagRoutes): Routes;

    // Override normal `ROUTES` that determine which lazy-loaded child routes to use by using  that use `featureFlag`
    abstract getRoutesFromFeatureFlagRoutesService(): Routes;
}

export type FeatureFlagRoutesFactory = (routes: FeatureFlagRoutes) => (featureFlagRoutesFactoryService: FactoryService) => Routes;
