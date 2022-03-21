import { FactoryService, FeatureFlagRoutes, FeatureFlagRoutesFactory } from "../models";

/**
 * Used to provide `ROUTES` when using `useFactory`
 *
 * Combines routes and `FeatureFlagRoutesFactoryService` routes
 *
 * @param routes {FeatureFlagRoutes} - routes provided as the first argument for `FeatureFlagRouterModule.child()`
 *
 * @returns `FeatureFlagRoutes[]`
 */
export const featureFlagRoutesFactory: FeatureFlagRoutesFactory = (routes: FeatureFlagRoutes) => (factoryService: FactoryService) => {
    return [
        // Override normal `ROUTES` that determine which lazy-loaded child routes to use by using  that use `featureFlag`
        ...factoryService.getRoutesFromFeatureFlagRoutesService(),

        // Fallback to the normal set of `ROUTES`
        ...factoryService.getRoutesFromFeatureFlagRoutes(routes),
    ];
};
