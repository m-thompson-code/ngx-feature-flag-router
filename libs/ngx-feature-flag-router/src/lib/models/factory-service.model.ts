import { Routes } from '@angular/router';
import { FeatureFlagRoutes } from './feature-flag-routes.model';

export abstract class FactoryService {
    // Fallback to the normal set of `ROUTES`
    abstract getRoutesFromFeatureFlagRoutes(featureFlagRoutes: FeatureFlagRoutes): Routes;

    // Override normal `ROUTES` that determine which lazy-loaded child routes to use by using  that use `featureFlag`
    abstract getRoutesFromFeatureFlagRoutesService(): Routes;
}

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
