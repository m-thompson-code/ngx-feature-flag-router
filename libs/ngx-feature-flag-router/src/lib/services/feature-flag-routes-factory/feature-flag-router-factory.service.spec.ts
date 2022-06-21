import { Injector, NgModule, NgModuleFactory as DeprecatedNgModuleFactory, NgModuleRef, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UrlSegment, UrlSegmentGroup } from '@angular/router';
import { BehaviorSubject, combineLatest, of, throwError } from 'rxjs';
import { FeatureFlagRoutesService, LoadChildrenObservableCallback } from '../../models';
import { FeatureFlagRoutesFactoryService } from './feature-flag-routes-factory.service';

const MOCK_SEGMENT_GROUP = {
    hasChildren: () => false,
} as UrlSegmentGroup;

@NgModule()
class MooModule {}

@NgModule()
class FeatureModule {}

/**
 * Mock NgModuleFactory
 */
class NgModuleFactory<T = any> extends DeprecatedNgModuleFactory<T> {
    constructor() {
        super();
    }

    get moduleType(): Type<T> {
        return {} as Type<T>;
    }

    create(parentInjector: Injector | null): NgModuleRef<T> {
        return { injector: parentInjector } as NgModuleRef<T>;
    }
}

describe('FeatureFlagRoutesFactoryService', () => {
    let service: FeatureFlagRoutesFactoryService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FeatureFlagRoutesFactoryService,
                {
                    provide: FeatureFlagRoutesService,
                    useValue: {
                        getFeatureRoutes: () => [],
                    },
                },
            ],
        });

        service = TestBed.inject(FeatureFlagRoutesFactoryService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('getLoadChildrenObservableCallback()', () => {
        it('should throw if argument isn\'t a function (Angular 9)', () => {
            const result = service.getLoadChildrenObservableCallback('string-import-mock' as any);

            expect(result).toThrowError('loadChildren must be a function');
        });

        it('should convert LoadChildren to LoadChildrenObservableCallback', (done) => {
            expect.assertions(1);

            const result = service.getLoadChildrenObservableCallback(() => MooModule);

            result().subscribe((loadChildren) => {
                expect(loadChildren).toBe(MooModule);
                done();
            });
        });

        it('should throw error when trying to wrap NgModuleFactory', (done) => {
            expect.assertions(1);

            const result = service.getLoadChildrenObservableCallback(() => new NgModuleFactory());

            result().subscribe({
                error: (error) => {
                    expect(error).toStrictEqual(new Error('NgModuleFactory is deprecated and is not supported'));
                    done();
                },
            });
        });
    });

    describe('getLoadChildrens()', () => {
        it('should default both loadChildrenCallbacks to first NgModule if they are out of sync of each other', (done) => {
            expect.assertions(3);

            const spy = jest.spyOn(console, 'error').mockImplementation(() => {
                /* mute console */
            });
            const mockFeatureFlag$ = new BehaviorSubject<boolean>(false);

            const [firstLoadChildren, secondLoadChildren] = service.getLoadChildrens(
                mockFeatureFlag$,
                () => of(MooModule),
                () => of(FeatureModule),
            );

            firstLoadChildren().subscribe();
            mockFeatureFlag$.next(true);
            secondLoadChildren().subscribe();

            expect(spy).toBeCalledWith('Unexpected modules were set out of sync of each other');
            combineLatest([firstLoadChildren(), secondLoadChildren()]).subscribe(([firstModule, secondModule]) => {
                expect(firstModule).toBe(MooModule);
                expect(secondModule).toBe(MooModule);
                done();
            });
        });

        it('should fallback to using first NgModule if there is an error emitting feature NgModule', (done) => {
            expect.assertions(1);

            const mockFeatureFlag$ = new BehaviorSubject<boolean>(false);

            const [, secondLoadChildren] = service.getLoadChildrens(
                mockFeatureFlag$,
                () => of(MooModule),
                () => throwError(() => new Error('unexpected feature flag error')),
            );

            secondLoadChildren().subscribe(module => {
                expect(module).toBe(MooModule);
                done();
            });
        });
    });

    describe('getRoutesFromFeatureFlagRoute()', () => {
        describe('featureFlagMatchesdInitialValue()', () => {
            it('should return true if featureFlag() return value is null', () => {
                const route = {
                    path: 'moo/cow',
                    loadChildren: () => MooModule,
                    alternativeLoadChildren: () => FeatureModule,
                    featureFlag: () => null as any,
                };

                const [firstRoute] = service.getRoutesFromFeatureFlagRoute(route);

                expect(
                    firstRoute.matcher!(
                        [
                            {
                                path: 'moo',
                            },
                            {
                                path: 'cow',
                            },
                        ] as UrlSegment[],
                        MOCK_SEGMENT_GROUP,
                        route,
                    ),
                ).toStrictEqual({
                    consumed: [
                        {
                            path: 'moo',
                        },
                        {
                            path: 'cow',
                        },
                    ],
                    posParams: {},
                });
            });

            it('should return true if featureFlag() return value is undefined', () => {
                const route = {
                    path: 'moo/cow',
                    loadChildren: () => MooModule,
                    alternativeLoadChildren: () => FeatureModule,
                    featureFlag: () => undefined as any,
                };

                const [firstRoute] = service.getRoutesFromFeatureFlagRoute(route);

                expect(
                    firstRoute.matcher!(
                        [
                            {
                                path: 'moo',
                            },
                            {
                                path: 'cow',
                            },
                        ] as UrlSegment[],
                        MOCK_SEGMENT_GROUP,
                        route,
                    ),
                ).toStrictEqual({
                    consumed: [
                        {
                            path: 'moo',
                        },
                        {
                            path: 'cow',
                        },
                    ],
                    posParams: {},
                });
            });

            it('should return featureFlag() return value if it is boolean (true)', () => {
                const route = {
                    path: 'moo/cow',
                    loadChildren: () => MooModule,
                    alternativeLoadChildren: () => FeatureModule,
                    featureFlag: () => true,
                };

                const [firstRoute] = service.getRoutesFromFeatureFlagRoute(route);

                expect(
                    firstRoute.matcher!(
                        [
                            {
                                path: 'moo',
                            },
                            {
                                path: 'cow',
                            },
                        ] as UrlSegment[],
                        MOCK_SEGMENT_GROUP,
                        route,
                    ),
                ).toStrictEqual({
                    consumed: [
                        {
                            path: 'moo',
                        },
                        {
                            path: 'cow',
                        },
                    ],
                    posParams: {},
                });
            });

            it('should return featureFlag() return value if it is boolean (false)', () => {
                let mockFeatureFlag = true;

                const route = {
                    path: 'moo/cow',
                    loadChildren: () => MooModule,
                    alternativeLoadChildren: () => FeatureModule,
                    featureFlag: () => mockFeatureFlag,
                };

                const [firstRoute] = service.getRoutesFromFeatureFlagRoute(route);

                const urlSegment = [
                    {
                        path: 'moo',
                    },
                    {
                        path: 'cow',
                    },
                ] as UrlSegment[];

                // Change feature flag value so secondRoute should be used instead of firstRoute
                mockFeatureFlag = false;

                expect(firstRoute.matcher!(urlSegment, MOCK_SEGMENT_GROUP, route)).toBeNull();
            });

            it('should return true or false when featureFlag() emits a value since it returns an Observable (true)', () => {
                const mockFeatureFlag$ = new BehaviorSubject<boolean>(true);

                const route = {
                    path: 'moo/cow',
                    loadChildren: () => MooModule,
                    alternativeLoadChildren: () => FeatureModule,
                    featureFlag: () => mockFeatureFlag$,
                };

                const [firstRoute] = service.getRoutesFromFeatureFlagRoute(route);

                // Subscribe to Observable to simular Router's navigation
                (firstRoute.loadChildren as LoadChildrenObservableCallback)().subscribe();

                expect(
                    firstRoute.matcher!(
                        [
                            {
                                path: 'moo',
                            },
                            {
                                path: 'cow',
                            },
                        ] as UrlSegment[],
                        MOCK_SEGMENT_GROUP,
                        route,
                    ),
                ).toStrictEqual({
                    consumed: [
                        {
                            path: 'moo',
                        },
                        {
                            path: 'cow',
                        },
                    ],
                    posParams: {},
                });
            });

            it('should return true or false when featureFlag() emits a value since it returns an Observable (false)', () => {
                const mockFeatureFlag$ = new BehaviorSubject<boolean>(true);

                const route = {
                    path: 'moo/cow',
                    loadChildren: () => MooModule,
                    alternativeLoadChildren: () => FeatureModule,
                    featureFlag: () => mockFeatureFlag$,
                };

                const [firstRoute] = service.getRoutesFromFeatureFlagRoute(route);

                // Subscribe to Observable to simular Router's navigation
                (firstRoute.loadChildren as LoadChildrenObservableCallback)().subscribe();

                firstRoute.matcher!(
                    [
                        {
                            path: 'moo',
                        },
                        {
                            path: 'cow',
                        },
                    ] as UrlSegment[],
                    MOCK_SEGMENT_GROUP,
                    route,
                );

                // Change feature flag value so secondRoute should be used instead of firstRoute
                mockFeatureFlag$.next(false);

                expect(
                    firstRoute.matcher!(
                        [
                            {
                                path: 'moo',
                            },
                            {
                                path: 'cow',
                            },
                        ] as UrlSegment[],
                        MOCK_SEGMENT_GROUP,
                        route,
                    ),
                ).toBeNull();
            });
        });
    });

    describe('getChildrenFromFeatureFlagRoutes()', () => {
        it('should get routes from children property', () => {
            const featureFlag = () => true;

            expect(
                service.getChildrenFromFeatureFlagRoutes({
                    children: [
                        {
                            path: 'moo/cow',
                            loadChildren: () => MooModule,
                            alternativeLoadChildren: () => FeatureModule,
                            featureFlag,
                        },
                    ],
                }),
            ).toStrictEqual([
                {
                    path: undefined,
                    featureFlagPath: 'moo/cow',
                    loadChildren: expect.any(Function),
                    alternativeLoadChildren: expect.any(Function),
                    featureFlag,
                    matcher: expect.any(Function),
                    children: undefined,
                },
                {
                    path: undefined,
                    featureFlagPath: 'moo/cow',
                    loadChildren: expect.any(Function),
                    alternativeLoadChildren: expect.any(Function),
                    featureFlag,
                    matcher: expect.any(Function),
                    children: undefined,
                },
            ]);
        });
    });
});
