import { Injectable, isDevMode, NgModuleFactory, OnDestroy } from '@angular/core';
import { LoadChildren, Route, UrlMatcher, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { catchError, map, mergeMap, shareReplay, take, takeUntil, tap } from 'rxjs/operators';
import { defaultUrlMatcher, wrapIntoObservable } from '../../angular-utils';
import {
    FactoryService,
    FeatureFlagRoute,
    FeatureFlagRoutes,
    FeatureFlagRoutesService,
    LegacyUrlMatcher,
    LoadChildrenObservableCallback,
    ModernUrlMatcher,
    PatchedRoute,
    ProcessedFeatureFlagRoute,
} from '../../models';
import { flattened } from '../../utils';

@Injectable()
export class FeatureFlagRoutesFactoryService implements FactoryService, OnDestroy {
    private readonly unsubscribe$ = new Subject<void>();
    constructor(private readonly featureFlagRoutesService: FeatureFlagRoutesService) {}

    getLoadChildrenObservableCallback(loadChildren: LoadChildren): LoadChildrenObservableCallback {
        return () => {
            // Typecheck for Angular 9 (which supports the deprecated string type for LoadChildren)
            if (typeof loadChildren !== 'function') {
                throw new Error('loadChildren must be a function');
            }

            const observableOfLoadChildren = wrapIntoObservable(loadChildren());

            return observableOfLoadChildren.pipe(
                map((loadChildrenValue) => {
                    if (loadChildrenValue instanceof NgModuleFactory) {
                        throw new Error('NgModuleFactory is deprecated and is not supported');
                    }

                    return loadChildrenValue;
                }),
            );
        };
    }

    getLoadChildrens(
        featureFlag: Observable<boolean>,
        loadChildren: LoadChildren,
        alternativeFeatureChildren: LoadChildren,
    ): [LoadChildrenObservableCallback, LoadChildrenObservableCallback] {
        const module: LoadChildrenObservableCallback = this.getLoadChildrenObservableCallback(loadChildren);
        const alternativeModule: LoadChildrenObservableCallback = this.getLoadChildrenObservableCallback(alternativeFeatureChildren);

        let modules: {
            first: LoadChildrenObservableCallback;
            second: LoadChildrenObservableCallback;
        } | null = null;

        const handleError = () => {
            if (isDevMode()) {
                console.error('`alternativeLoadChildren` is unreliable. All routes will use `loadChildren` instead');
            }

            modules = {
                first: module,
                second: module,
            };
        };

        const handleFeatureFlagValue = (featureFlagValue: boolean): void => {
            const expectedFirstModule = featureFlagValue ? alternativeModule : module;
            const expectedSecondModule = featureFlagValue ? module : alternativeModule;

            if (modules && (modules.first !== expectedFirstModule || modules.second !== expectedSecondModule)) {
                console.error('Unexpected modules were set out of sync of each other');
                handleError();
                return;
            }

            modules = {
                first: expectedFirstModule,
                second: expectedSecondModule,
            };
        };

        const firstLoadChildren = () => {
            if (modules && modules.first) {
                return modules.first();
            }

            return featureFlag.pipe(
                mergeMap((featureFlagValue: boolean) => {
                    handleFeatureFlagValue(featureFlagValue);

                    return modules!.first();
                }),
                catchError((error) => {
                    console.error(error);
                    handleError();
                    return module();
                }),
            );
        };

        const secondLoadChildren = () => {
            if (modules && modules.second) {
                return modules.second();
            }

            return featureFlag.pipe(
                mergeMap((featureFlagValue: boolean) => {
                    handleFeatureFlagValue(featureFlagValue);

                    return modules!.second();
                }),
                catchError((error) => {
                    console.error(error);
                    handleError();
                    return module();
                }),
            );
        };

        return [() => firstLoadChildren(), () => secondLoadChildren()];
    }

    getUrlMatchers(featureFlagMatchesInitialValue: () => boolean, possibleUrlMatcher?: UrlMatcher): [UrlMatcher, UrlMatcher] {
        const urlMatcher: ModernUrlMatcher = possibleUrlMatcher || defaultUrlMatcher;

        const firstUrlMatcher: ModernUrlMatcher = (
            segments: UrlSegment[],
            group: UrlSegmentGroup,
            route: Route,
        ) => {
            // Since current feature flag value matches the initial value found,
            // it's safe to use the first lazy-load route since it lazy-loads alternative module based on feature flag
            if (featureFlagMatchesInitialValue()) {
                return urlMatcher(segments, group, route);
            }

            // Since current feature flag value doesn't match initial value found,
            // second lazy-load route should be used since it lazy-loads original module based on feature flag
            return null;
        };

        return [firstUrlMatcher, urlMatcher] as [LegacyUrlMatcher, LegacyUrlMatcher];
    }

    getRoutesFromFeatureFlagRoute(featureFlagRoute: FeatureFlagRoute): [ProcessedFeatureFlagRoute, ProcessedFeatureFlagRoute] {
        const { featureFlag, loadChildren, alternativeLoadChildren } = featureFlagRoute;

        const featureFlagFunctionReturn = featureFlag();

        // If null, firstLoadChildrenFeatureFlagValue will initalize when initialFeatureFlag$
        // emits its first value (boolean)
        let firstLoadChildrenFeatureFlagValue: boolean | null =
            typeof featureFlagFunctionReturn === 'boolean' ? featureFlagFunctionReturn : null;
        let observedFeatureFlagValue: boolean | null = firstLoadChildrenFeatureFlagValue;

        const featureFlagMatchesInitialValue = () => {
            if (firstLoadChildrenFeatureFlagValue == null) {
                return true;
            }

            const syncronousFeatureFlagFunctionValue = featureFlag();

            if (typeof syncronousFeatureFlagFunctionValue === 'boolean') {
                observedFeatureFlagValue = syncronousFeatureFlagFunctionValue;
            }

            return observedFeatureFlagValue === firstLoadChildrenFeatureFlagValue;
        };

        const featureFlag$: Observable<boolean> = wrapIntoObservable(featureFlagFunctionReturn);

        // featureFlag returns a boolean syncronously, so there's no reason to
        // make a subscription since the observed feature flag value won't be used
        // to determine if first UrlMatcher should fail
        if (typeof featureFlagFunctionReturn !== 'boolean') {
            featureFlag$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
                observedFeatureFlagValue = value;
            });
        }

        const initialFeatureFlag$ = featureFlag$.pipe(
            tap((loadChildFeatureFlagValue) => {
                if (firstLoadChildrenFeatureFlagValue == null) {
                    firstLoadChildrenFeatureFlagValue = loadChildFeatureFlagValue;
                }

                observedFeatureFlagValue = loadChildFeatureFlagValue;
            }),
            shareReplay(1),
            take(1),
        );

        const [firstLoadChildren, secondLoadChildren] = this.getLoadChildrens(initialFeatureFlag$, loadChildren, alternativeLoadChildren);

        const [firstUrlMatcher, secondUrlMatcher] = this.getUrlMatchers(featureFlagMatchesInitialValue, featureFlagRoute.matcher);

        const children = this.getChildrenFromFeatureFlagRoutes(featureFlagRoute);

        return [
            {
                ...featureFlagRoute,
                // Store path as a different property
                // This is done to avoid runtime error when Routehas both `path` and `matcher` property
                // https://github.com/angular/angular/blob/13.3.x/packages/router/src/utils/config.ts#L67
                featureFlagPath: featureFlagRoute.path,
                // Note that if we end up using `path` again, we must avoid empty strings
                // to allow for UrlMatcher always run on navigate, path is set to `undefined` instead of empty string
                // Angular normally avoids using the UrlMatcher if path is empty string since Angular will cache the first result
                path: undefined,
                children,
                loadChildren: firstLoadChildren,
                matcher: firstUrlMatcher,
            },
            {
                ...featureFlagRoute,
                // Store path as a different property
                // This is done to avoid runtime error when Routehas both path and matcher property
                // https://github.com/angular/angular/blob/13.3.x/packages/router/src/utils/config.ts#L67
                featureFlagPath: featureFlagRoute.path,
                // Note that if we end up using `path` again, we must avoid empty strings
                // to allow for UrlMatcher always run on navigate, path is set to `undefined` instead of empty string
                // Angular normally avoids using the UrlMatcher if path is empty string since Angular will cache the first result
                path: undefined,
                children,
                loadChildren: secondLoadChildren,
                matcher: secondUrlMatcher,
            },
        ];
    }

    getChildrenFromFeatureFlagRoutes(featureFlagRoutes: FeatureFlagRoute | PatchedRoute): ProcessedFeatureFlagRoute[] | undefined {
        if (!featureFlagRoutes.children) {
            return undefined;
        }

        return this.getRoutesFromFeatureFlagRoutes(featureFlagRoutes.children);
    }

    getRoutesFromFeatureFlagRoutes(featureFlagRoutes: FeatureFlagRoutes): ProcessedFeatureFlagRoute[] {
        return flattened(
            featureFlagRoutes.map((featureFlagRoute) => {
                if (!featureFlagRoute.alternativeLoadChildren) {
                    return [
                        {
                            ...featureFlagRoute,
                            children: this.getChildrenFromFeatureFlagRoutes(featureFlagRoute),
                        },
                    ];
                }

                return this.getRoutesFromFeatureFlagRoute(featureFlagRoute);
            }),
        );
    }

    getRoutesFromFeatureFlagRoutesService(): ProcessedFeatureFlagRoute[] {
        return this.getRoutesFromFeatureFlagRoutes(this.featureFlagRoutesService.getFeatureRoutes());
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
