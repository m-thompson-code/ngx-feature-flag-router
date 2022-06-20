import { NgModule, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, Routes } from '@angular/router';
import { Observable, forkJoin, of, defer } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { FeatureFlagRouterModule } from '../feature-flag-router.module';
import { FeatureFlagRoutesFactoryService } from '../services/feature-flag-routes-factory';
import { DefaultFeatureFlagRoutesService } from '../services/default-feature-flag-routes';
import { featureFlagRoutesFactory } from './feature-flag-routes-factory';
import { FeatureFlagRoutes, FeatureFlagRoutesService } from '../models';

@NgModule()
class MooModule {}

@NgModule()
class FeatureMooModule {}

const TEST_FEATURE_FLAG_ROUTES_SERVICE_FEATURE_FLAG_FUNCTION = () => of(true);

class TestFeatureFlagRoutesService implements FeatureFlagRoutesService {
    getFeatureRoutes(): FeatureFlagRoutes {
        return [
            {
                path: 'milk',
                loadChildren: () => of('first milk' as unknown as Type<unknown>),
                alternativeLoadChildren: () => of('second milk' as unknown as Type<unknown>),
                featureFlag: TEST_FEATURE_FLAG_ROUTES_SERVICE_FEATURE_FLAG_FUNCTION,
            },
            { path: 'bull' },
        ];
    }
}

describe('featureFlagRoutesFactory()', () => {
    describe('Using DefaultFeatureFlagRoutesService', () => {
        let service!: FeatureFlagRoutesFactoryService;
        let defaultFeatureFlagRoutesService!: DefaultFeatureFlagRoutesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                // By importing FeatureFlagRouterModule.forChild([]),
                // FeatureFlagRoutesService should be provided by DefaultFeatureFlagRoutesService
                imports: [FeatureFlagRouterModule.forChild([])],
            });

            service = TestBed.inject(FeatureFlagRoutesFactoryService);
            defaultFeatureFlagRoutesService = TestBed.inject(DefaultFeatureFlagRoutesService);
        });

        it('should use DefaultFeatureFlagRoutesService if no other service is provided for FeatureFlagRoutesService', () => {
            const spy = jest.spyOn(defaultFeatureFlagRoutesService, 'getFeatureRoutes');

            featureFlagRoutesFactory([])(service);

            expect(spy).toBeCalledTimes(1);
        });

        it('should recreate the same functionality as RouterModule.child()', () => {
            const result = featureFlagRoutesFactory([{ path: 'moo' }, { path: 'cow' }]);
            expect(result(service)).toStrictEqual([
                { path: 'moo', children: undefined },
                { path: 'cow', children: undefined },
            ]);
        });

        describe('using alternativeLoadChild and featureFlag', () => {
            let featureFlagValue = false;
            let shouldError = false;

            let routes!: Routes;

            let firstRoute!: Route & {
                loadChildren: () => Observable<MooModule | FeatureMooModule>;
            };
            let secondRoute!: Route & {
                loadChildren: () => Observable<MooModule | FeatureMooModule>;
            };

            let testResults!: Observable<
                [
                    boolean | null,
                    {
                        firstModule: MooModule | FeatureMooModule;
                        secondModule: MooModule | FeatureMooModule;
                    },
                ]
            >;

            const featureFlag = () =>
                defer(() => {
                    if (shouldError) {
                        throw new Error('Expected error from test');
                    }

                    return of(featureFlagValue);
                });

            beforeEach(() => {
                featureFlagValue = false;
                shouldError = false;

                const loadChildren = () => of(MooModule);
                const alternativeLoadChildren = () => of(FeatureMooModule);

                routes = featureFlagRoutesFactory([
                    {
                        path: 'moo',
                        loadChildren,
                        alternativeLoadChildren,
                        featureFlag,
                    },
                    { path: 'cow' },
                ])(service);

                firstRoute = routes[0] as Route & {
                    loadChildren: () => Observable<MooModule | FeatureMooModule>;
                };
                secondRoute = routes[1] as Route & {
                    loadChildren: () => Observable<MooModule | FeatureMooModule>;
                };

                const firstLoadChildren = firstRoute.loadChildren as () => Observable<MooModule | FeatureMooModule>;
                const secondLoadChildren = secondRoute.loadChildren as () => Observable<MooModule | FeatureMooModule>;

                testResults = forkJoin([
                    featureFlag().pipe(catchError(() => of(null))),
                    // first loadChildren is expected to load before trying to load second
                    // If they're loaded at the same time, behavior is expected to load (original) loadChildren
                    // for both first and second loadChildren
                    firstLoadChildren().pipe(
                        mergeMap((firstModule) =>
                            secondLoadChildren().pipe(
                                map((secondModule) => ({
                                    firstModule,
                                    secondModule,
                                })),
                            ),
                        ),
                    ),
                ]);
            });

            beforeEach(() => {
                jest.resetAllMocks();
            });

            it('should be able to generate two routes per route with alternativeLoadChild', () => {
                expect(routes).toStrictEqual([
                    {
                        path: undefined,
                        featureFlagPath: 'moo',
                        loadChildren: expect.any(Function),
                        alternativeLoadChildren: expect.any(Function),
                        featureFlag,
                        matcher: expect.any(Function),
                        children: undefined,
                    },
                    {
                        path: undefined,
                        featureFlagPath: 'moo',
                        loadChildren: expect.any(Function),
                        alternativeLoadChildren: expect.any(Function),
                        featureFlag,
                        matcher: expect.any(Function),
                        children: undefined,
                    },
                    { path: 'cow', children: undefined },
                ]);
            });

            it('first loadChildren should load (original) loadChildren if featureFlag is off', (done) => {
                expect.assertions(3);

                featureFlagValue = false;
                shouldError = false;

                testResults.subscribe(([flag, { firstModule, secondModule }]) => {
                    expect(flag).toBe(false);
                    expect(firstModule).toBe(MooModule);
                    expect(secondModule).toBe(FeatureMooModule);
                    done();
                });
            });

            it('first loadChildren should load alternativeLoadChildren if featureFlag is on', (done) => {
                expect.assertions(3);

                featureFlagValue = true;
                shouldError = false;

                testResults.subscribe(([flag, { firstModule, secondModule }]) => {
                    expect(flag).toBe(true);
                    expect(firstModule).toBe(FeatureMooModule);
                    expect(secondModule).toBe(MooModule);
                    done();
                });
            });

            it('first and second loadChildren should load (original) loadChildren if error', (done) => {
                const spy = jest.spyOn(console, 'error').mockImplementation(() => {
                    /* mute console */
                });

                expect.assertions(6);

                featureFlagValue = true;
                shouldError = true;

                testResults.subscribe(([flag, { firstModule, secondModule }]) => {
                    expect(spy).nthCalledWith(1, new Error('Expected error from test'));
                    expect(spy).nthCalledWith(2, '`alternativeLoadChildren` is unreliable. All routes will use `loadChildren` instead');
                    expect(spy).toBeCalledTimes(2);

                    expect(flag).toBe(null); // Specific to this test, flag is expected to be `null` if there's an error
                    expect(firstModule).toBe(MooModule);
                    expect(secondModule).toBe(MooModule);

                    done();
                });
            });

            it('If both routes are preloaded (like when using PreloadAllModule), feature flag loading behavior should continue to work', (done) => {
                expect.assertions(4);

                const spy = jest.spyOn(console, 'error').mockImplementation(() => {
                    /* mute console */
                });

                featureFlagValue = true;
                shouldError = false;

                const firstLoadChildren = firstRoute.loadChildren as () => Observable<MooModule | FeatureMooModule>;
                const secondLoadChildren = secondRoute.loadChildren as () => Observable<MooModule | FeatureMooModule>;

                forkJoin([featureFlag().pipe(catchError(() => of(null))), firstLoadChildren(), secondLoadChildren()]).subscribe(
                    ([flag, firstModule, secondModule]) => {
                        expect(spy).toBeCalledTimes(0);

                        expect(flag).toBe(true);
                        expect(firstModule).toBe(FeatureMooModule);
                        expect(secondModule).toBe(MooModule);

                        done();
                    },
                );
            });
        });
    });

    describe('Using custom injected FeatureFlagRoutesService', () => {
        let service!: FeatureFlagRoutesFactoryService;
        let injectedFeatureFlagRoutesService!: FeatureFlagRoutesService;
        let defaultFeatureFlagRoutesService!: DefaultFeatureFlagRoutesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: FeatureFlagRoutesService,
                        useClass: TestFeatureFlagRoutesService,
                    },
                ],
                imports: [FeatureFlagRouterModule.forChild([])],
            });

            service = TestBed.inject(FeatureFlagRoutesFactoryService);
            injectedFeatureFlagRoutesService = TestBed.inject(FeatureFlagRoutesService);
            defaultFeatureFlagRoutesService = TestBed.inject(DefaultFeatureFlagRoutesService);
        });

        it('should not DefaultFeatureFlagRoutesService if another service is provided for FeatureFlagRoutesService', () => {
            const spy = jest.spyOn(defaultFeatureFlagRoutesService, 'getFeatureRoutes');
            const spy2 = jest.spyOn(injectedFeatureFlagRoutesService, 'getFeatureRoutes');

            featureFlagRoutesFactory([])(service);

            expect(spy).toBeCalledTimes(0);
            expect(spy2).toBeCalledTimes(1);
        });

        it('should unshift addtional routes from injected FeatureFlagRoutesService', () => {
            const featureFlag = () => true;

            const loadChildren = () => of(MooModule);
            const alternativeLoadChildren = () => of(FeatureMooModule);

            const routes = featureFlagRoutesFactory([
                {
                    path: 'moo',
                    loadChildren,
                    alternativeLoadChildren,
                    featureFlag,
                },
                { path: 'cow' },
            ])(service);

            expect(routes).toStrictEqual([
                {
                    path: undefined,
                    featureFlagPath: 'milk',
                    loadChildren: expect.any(Function),
                    alternativeLoadChildren: expect.any(Function),
                    featureFlag: TEST_FEATURE_FLAG_ROUTES_SERVICE_FEATURE_FLAG_FUNCTION,
                    matcher: expect.any(Function),
                    children: undefined,
                },
                {
                    path: undefined,
                    featureFlagPath: 'milk',
                    loadChildren: expect.any(Function),
                    alternativeLoadChildren: expect.any(Function),
                    featureFlag: TEST_FEATURE_FLAG_ROUTES_SERVICE_FEATURE_FLAG_FUNCTION,
                    matcher: expect.any(Function),
                    children: undefined,
                },
                { path: 'bull', children: undefined },
                {
                    path: undefined,
                    featureFlagPath: 'moo',
                    loadChildren: expect.any(Function),
                    alternativeLoadChildren: expect.any(Function),
                    featureFlag,
                    matcher: expect.any(Function),
                    children: undefined,
                },
                {
                    path: undefined,
                    featureFlagPath: 'moo',
                    loadChildren: expect.any(Function),
                    alternativeLoadChildren: expect.any(Function),
                    featureFlag,
                    matcher: expect.any(Function),
                    children: undefined,
                },
                { path: 'cow', children: undefined },
            ]);
        });
    });
});
