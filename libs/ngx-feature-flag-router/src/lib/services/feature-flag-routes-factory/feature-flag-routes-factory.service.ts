import { Injectable, isDevMode, NgModuleFactory, OnDestroy } from '@angular/core';
import { LoadChildren, Route, UrlMatcher, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { catchError, map, mergeMap, shareReplay, take, takeUntil, tap } from 'rxjs/operators';
import { defaultUrlMatcher, wrapIntoObservable } from '../../angular-utils';
import {
    FactoryService,
    FeatureFlag,
    FeatureFlagPatchedRoutes,
    FeatureFlagRoute,
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

    /**
     * Returns 2 `loadComponent` or `loadChildren` callbacks where both are synced together by `featureFlag`
     */
    getSyncedFeatureFlagModules<T>(
        featureFlag: Observable<boolean>,
        module: () => Observable<T>,
        alternativeModule: () => Observable<T>,
    ): [() => Observable<T>, () => Observable<T>] {
        let modules: {
            first: () => Observable<T>;
            second: () => Observable<T>;
        } | null = null;

        const handleError = () => {
            if (isDevMode()) {
                console.error('`alternativeModule` is unreliable. All routes will use `module` instead');
            }

            modules = {
                first: module,
                second: module,
            };
        };

        const onCatchError = (error: unknown): Observable<T> => {
            console.error(error);
            // Update first and second module to both be the same module (the first one)
            handleError();
            // Return first Module always on error
            return module();
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

        const firstLoadChildren: () => Observable<T> = () => {
            if (modules && modules.first) {
                return modules.first();
            }

            return featureFlag.pipe(
                mergeMap((featureFlagValue: boolean) => {
                    handleFeatureFlagValue(featureFlagValue);

                    return modules!.first();
                }),
                catchError(onCatchError),
            );
        };

        const secondLoadChildren: () => Observable<T> = () => {
            if (modules && modules.second) {
                return modules.second();
            }

            return featureFlag.pipe(
                mergeMap((featureFlagValue: boolean) => {
                    handleFeatureFlagValue(featureFlagValue);

                    return modules!.second();
                }),
                catchError(onCatchError),
            );
        };

        return [() => firstLoadChildren(), () => secondLoadChildren()];
    }

    getUrlMatchers(featureFlagMatchesInitialValue: () => boolean, possibleUrlMatcher?: UrlMatcher): [UrlMatcher, UrlMatcher] {
        const urlMatcher: ModernUrlMatcher = possibleUrlMatcher || defaultUrlMatcher;

        const firstUrlMatcher: ModernUrlMatcher = (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => {
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

    getFeatureFlagListeners(featureFlag: FeatureFlag) {
        const featureFlagFunctionReturn = featureFlag();

        // If null, firstLoadChildrenFeatureFlagValue will initalize when initialFeatureFlag$
        // emits its first value (boolean)
        let firstLoadChildrenFeatureFlagValue: boolean | null =
            typeof featureFlagFunctionReturn === 'boolean' ? featureFlagFunctionReturn : null;
        let observedFeatureFlagValue: boolean | null = firstLoadChildrenFeatureFlagValue;

        const featureFlagMatchesInitialValue: () => boolean = () => {
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
            shareReplay({ bufferSize: 0, refCount: false }),
            take(1),
        );

        return { featureFlagMatchesInitialValue, initialFeatureFlag$ };
    }

    getPreprocessedFeatureFlagRoutes(
        featureFlagRoute: FeatureFlagRoute,
        featureFlagMatchesInitialValue: () => boolean,
    ): [ProcessedFeatureFlagRoute, ProcessedFeatureFlagRoute] {
        const [firstUrlMatcher, secondUrlMatcher] = this.getUrlMatchers(featureFlagMatchesInitialValue, featureFlagRoute.matcher);

        const children = this.getChildrenFromFeatureFlagRoutes(featureFlagRoute);

        // Remove path, we'll use featureFlagPath instead with our version of the defaultUrlMatcher
        //
        // Store path as a different property
        // This is done to avoid runtime error when Routehas both `path` and `matcher` property
        // https://github.com/angular/angular/blob/13.3.x/packages/router/src/utils/config.ts#L67
        //
        // Note that if we end up using `path` again, we must avoid empty strings
        // to allow for UrlMatcher always run on navigate, path is set to `undefined` instead of empty string
        // Angular normally avoids using the UrlMatcher if path is empty string since Angular will cache the first result
        const { path, ...rest } = featureFlagRoute;

        return [
            {
                ...rest,
                featureFlagPath: featureFlagRoute.path,
                children,
                matcher: firstUrlMatcher,
            },
            {
                ...rest,
                featureFlagPath: featureFlagRoute.path,
                children,
                matcher: secondUrlMatcher,
            },
        ];
    }

    getRoutesFromFeatureFlagRoute(featureFlagRoute: FeatureFlagRoute): [ProcessedFeatureFlagRoute, ProcessedFeatureFlagRoute] {
        const {
            featureFlag,
            loadChildren,
            alternativeLoadChildren,
            // START_A14_CODE
            loadComponent,
            alternativeLoadComponent,
            // END_A14_CODE
        } = featureFlagRoute;

        const { featureFlagMatchesInitialValue, initialFeatureFlag$ } = this.getFeatureFlagListeners(featureFlag);

        const [firstRoute, secondRoute] = this.getPreprocessedFeatureFlagRoutes(featureFlagRoute, featureFlagMatchesInitialValue);

        if (alternativeLoadChildren) {
            const [firstLoadChildren, secondLoadChildren] = this.getSyncedFeatureFlagModules(
                initialFeatureFlag$,
                this.getLoadChildrenObservableCallback(loadChildren),
                this.getLoadChildrenObservableCallback(alternativeLoadChildren),
            );

            return [
                {
                    ...firstRoute,
                    loadChildren: firstLoadChildren,
                },
                {
                    ...secondRoute,
                    loadChildren: secondLoadChildren,
                },
            ];
        }

        // START_A14_CODE
        if (alternativeLoadComponent) {
            const [firstLoadComponent, secondLoadComponent] = this.getSyncedFeatureFlagModules(
                initialFeatureFlag$,
                () => wrapIntoObservable(loadComponent()),
                () => wrapIntoObservable(alternativeLoadComponent()),
            );

            return [
                {
                    ...firstRoute,
                    loadComponent: firstLoadComponent,
                },
                {
                    ...secondRoute,
                    loadComponent: secondLoadComponent,
                },
            ];
        }
        // END_A14_CODE

        return [firstRoute, secondRoute];
    }

    getChildrenFromFeatureFlagRoutes(featureFlagRoutes: FeatureFlagRoute | PatchedRoute): ProcessedFeatureFlagRoute[] | undefined {
        if (!featureFlagRoutes.children) {
            return;
        }

        return this.getRoutesFromFeatureFlagRoutes(featureFlagRoutes.children);
    }

    getRoutesFromFeatureFlagRoutes(featureFlagRoutes: FeatureFlagPatchedRoutes): ProcessedFeatureFlagRoute[] {
        return flattened(
            featureFlagRoutes.map((featureFlagRoute) => {
                if (!this.isFeatureFlagRoute(featureFlagRoute)) {
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

    isFeatureFlagRoute(featureFlagRoute: FeatureFlagRoute | PatchedRoute): featureFlagRoute is FeatureFlagRoute {
        if (
            !featureFlagRoute.featureFlag &&
            !featureFlagRoute.alternativeLoadChildren &&
            // START_A14_CODE
            !featureFlagRoute.alternativeLoadComponent
            // END_A14_CODE
        ) {
            return false;
        }

        return true;
    }

    getRoutesFromFeatureFlagRoutesService(): ProcessedFeatureFlagRoute[] {
        return this.getRoutesFromFeatureFlagRoutes(this.featureFlagRoutesService.getFeatureRoutes());
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
