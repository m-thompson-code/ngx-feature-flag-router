import { DemoRoute, FeatureFlag } from './demo-storage.model';

export const getFeatureFlagKey = (route: DemoRoute): `feature-flag__${DemoRoute}` => {
    return `feature-flag__${route}`;
};

export const setFeatureFlagValue = (route: DemoRoute, featureFlag: FeatureFlag): void => {
    localStorage.setItem(getFeatureFlagKey(route), featureFlag || FeatureFlag.OFF);
};

export const getFeatureFlagValue = (route: DemoRoute): FeatureFlag => {
    const featureFlag = localStorage.getItem(getFeatureFlagKey(route));

    if (featureFlag === FeatureFlag.ON) {
        return FeatureFlag.ON;
    }

    return FeatureFlag.OFF;
};
