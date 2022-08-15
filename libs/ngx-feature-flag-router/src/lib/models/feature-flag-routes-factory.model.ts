import { FactoryService } from './factory-service.model';
import { FeatureFlagRoutes, PatchedRoute } from './feature-flag-routes.model';

export type FeatureFlagRoutesFactory = (routes: FeatureFlagRoutes) => (featureFlagRoutesFactoryService: FactoryService) => PatchedRoute[];
