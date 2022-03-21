import { Injectable, isDevMode, OnDestroy, Type } from "@angular/core";
import { LoadChildrenCallback, Route, Routes, UrlMatcher, UrlSegment, UrlSegmentGroup } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { catchError, mergeMap, shareReplay, take, takeUntil, tap } from "rxjs/operators";
import { defaultUrlMatcher, wrapIntoObservable } from "../../angular-utils";
import {
    FactoryService,
    FeatureFlagRoute,
    FeatureFlagRoutes,
    FeatureFlagRoutesService,
    LegacyUrlMatcher,
    ModernUrlMatcher,
} from "../../models";
import { flattened } from "../../utils";

@Injectable()
export class FeatureFlagRoutesFactoryService implements FactoryService, OnDestroy {
    private readonly unsubscribe$ = new Subject<void>();
    constructor(private readonly featureFlagRoutesService: FeatureFlagRoutesService) {}

    getLoadChildrens(
        featureFlag: Observable<boolean>,
        loadChildren: LoadChildrenCallback,
        alternativeFeatureChildren: LoadChildrenCallback,
    ): [() => Observable<Type<unknown>>, () => Observable<Type<unknown>>] {
        const module: () => Observable<Type<unknown>> = () => wrapIntoObservable(loadChildren());
        const alternativeModule: () => Observable<Type<unknown>> = () => wrapIntoObservable(alternativeFeatureChildren());

        let modules: {
            first: () => Observable<Type<unknown>>;
            second: () => Observable<Type<unknown>>;
        } | null = null;

        const handleError = () => {
            if (isDevMode()) {
                console.error("`alternativeLoadChildren` is unreliable. All routes will use `loadChildren` instead");
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
                console.error("Unexpected modules were set out of sync of each other");
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

                    if (!modules || !modules.first) {
                        throw new Error("Unexpected missing first module");
                    }

                    return modules.first();
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

                    if (!modules || !modules.second) {
                        throw new Error("Unexpected missing second module");
                    }

                    return modules.second();
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

    getUrlMatchers(featureFlagMatchesdInitialValue: () => boolean, possibleUrlMatcher?: UrlMatcher): [UrlMatcher, UrlMatcher] {
        const urlMatcher: ModernUrlMatcher = possibleUrlMatcher || defaultUrlMatcher;

        const firstUrlMatcher: ModernUrlMatcher = (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => {
            // Since current feature flag value matches the initial value found,
            // it's safe to use the first lazy-load route since it lazy-loads alternative module based on feature flag
            if (featureFlagMatchesdInitialValue()) {
                return urlMatcher(segments, group, route);
            }

            // Since current feature flag value doesn't match initial value found,
            // second lazy-load route should be used since it lazy-loads original module based on feature flag
            return null;
        };

        return [firstUrlMatcher, urlMatcher] as [LegacyUrlMatcher, LegacyUrlMatcher];
    }

    getRoutesFromFeatureFlagRoute(featureFlagRoute: FeatureFlagRoute): [Route, Route] {
        const { featureFlag, loadChildren, alternativeLoadChildren } = featureFlagRoute;

        const featureFlagFunctionReturn = featureFlag();

        let firstLoadChildrenFeatureFlagValue: boolean | null =
            typeof featureFlagFunctionReturn === "boolean" ? featureFlagFunctionReturn : null;
        let observedFeatureFlagValue: boolean | null = firstLoadChildrenFeatureFlagValue;

        const featureFlagMatchesdInitialValue = () => {
            if (firstLoadChildrenFeatureFlagValue == null) {
                return true;
            }

            const syncronousFeatureFlagFunctionValue = featureFlag();

            if (typeof syncronousFeatureFlagFunctionValue === "boolean") {
                observedFeatureFlagValue = syncronousFeatureFlagFunctionValue;
            }

            return observedFeatureFlagValue === firstLoadChildrenFeatureFlagValue;
        };

        const featureFlag$: Observable<boolean> = wrapIntoObservable(featureFlagFunctionReturn);

        // featureFlag returns a boolean syncronously, so there's no reason to
        // make a subscription since the observed feature flag value won't be used
        // to determine if first UrlMatcher should fail
        if (typeof featureFlagFunctionReturn !== "boolean") {
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

        const [firstUrlMatcher, secondUrlMatcher] = this.getUrlMatchers(featureFlagMatchesdInitialValue, featureFlagRoute.matcher);

        const children = this.getChildrenFromFeatureFlagRoutes(featureFlagRoute);

        // Avoid setting path to empty string,
        // to allow for UrlMatcher always run on navigate, path is set to `undefined` instead of empty string
        // Angular normally avoids using the UrlMatcher if path is empty string since they cache the first result
        const path = featureFlagRoute.path || undefined;

        return [
            {
                ...featureFlagRoute,
                path,
                children,
                loadChildren: firstLoadChildren,
                matcher: firstUrlMatcher,
            },
            {
                ...featureFlagRoute,
                path,
                children,
                loadChildren: secondLoadChildren,
                matcher: secondUrlMatcher,
            },
        ];
    }

    getChildrenFromFeatureFlagRoutes(featureFlagRoutes: FeatureFlagRoute | Route): Routes | undefined {
        if (!featureFlagRoutes.children) {
            return undefined;
        }

        return this.getRoutesFromFeatureFlagRoutes(featureFlagRoutes.children);
    }

    getRoutesFromFeatureFlagRoutes(featureFlagRoutes: FeatureFlagRoutes): Routes {
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

    getRoutesFromFeatureFlagRoutesService(): Routes {
        return this.getRoutesFromFeatureFlagRoutes(this.featureFlagRoutesService.getFeatureRoutes());
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
