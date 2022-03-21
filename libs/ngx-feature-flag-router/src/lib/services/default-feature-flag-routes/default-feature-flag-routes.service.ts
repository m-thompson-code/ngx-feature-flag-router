import { FeatureFlagRoutes, FeatureFlagRoutesService } from '../../models';

/**
 * `FeatureFlagRoutesService` used when no `FeatureFlagRoutesService` is provided
 *
 * Returns empty `FeatureFlagRoutes` Array
 */
export class DefaultFeatureFlagRoutesService implements FeatureFlagRoutesService {
    getFeatureRoutes(): FeatureFlagRoutes {
        return [];
    }
}
