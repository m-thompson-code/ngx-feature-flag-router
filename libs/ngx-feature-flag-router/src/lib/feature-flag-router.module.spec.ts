import { TestBed } from "@angular/core/testing";
import { Router, Routes, ROUTES } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Component, Injectable, NgModule } from "@angular/core";
import { FeatureFlagRoutesFactoryService } from "./services";
import { FeatureFlagRoutes, FeatureFlagRoutesService } from "./models";
import { FeatureFlagRouterModule } from "./feature-flag-router.module";

@Component({})
class MockComponent {}

@Component({})
class AnotherMockComponent {}

@NgModule()
class MockModule {}

@NgModule()
class AnotherMockModule {}

const MOCK_LOAD_CHILDREN = () => Promise.resolve(MockModule);
const ANOTHER_MOCK_LOAD_CHILDREN = () => Promise.resolve(AnotherMockModule);

@Injectable()
class TestFeatureFlagRoutesService implements FeatureFlagRoutesService {
    getFeatureRoutes(): FeatureFlagRoutes {
        return [
            {
                path: "milk",
                loadChildren: ANOTHER_MOCK_LOAD_CHILDREN,
            },
            { path: "bull", component: AnotherMockComponent },
        ];
    }
}

describe("FeatureFlagRouterModule", () => {
    it("should have a module definition", async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, FeatureFlagRouterModule],
        }).compileComponents();

        expect(FeatureFlagRouterModule).toBeDefined();

        expect(TestBed.inject(ROUTES)).toStrictEqual([[]]);
    });

    it("should provide FeatureFlagRoutesService and FeatureFlagRoutesFactoryService", async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, FeatureFlagRouterModule.forChild([])],
        }).compileComponents();

        expect(FeatureFlagRouterModule).toBeDefined();
        expect(TestBed.inject(FeatureFlagRoutesService)).toBeDefined();
        expect(TestBed.inject(FeatureFlagRoutesFactoryService)).toBeDefined();
    });

    it("should set routes to Router.config", async () => {
        const featureFlagRoutes: Routes = [
            {
                path: "moo",
                loadChildren: MOCK_LOAD_CHILDREN,
                children: undefined,
            },
            { path: "cow", component: MockComponent, children: undefined },
        ];

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, FeatureFlagRouterModule.forChild(featureFlagRoutes)],
        }).compileComponents();

        expect(TestBed.inject(Router).config).toStrictEqual(featureFlagRoutes);

        expect(TestBed.inject(ROUTES)).toStrictEqual([[], featureFlagRoutes]);
    });

    it("should also use injected TestFeatureFlagRoutesService to set Router.config", async () => {
        const featureFlagRoutes: Routes = [
            { path: "moo", loadChildren: MOCK_LOAD_CHILDREN },
            { path: "cow", component: MockComponent },
        ];

        await TestBed.configureTestingModule({
            providers: [TestFeatureFlagRoutesService],
            imports: [RouterTestingModule, FeatureFlagRouterModule.forChild(featureFlagRoutes, TestFeatureFlagRoutesService)],
        }).compileComponents();

        const additionalExpectedRoutes: Routes = [
            {
                path: "milk",
                loadChildren: ANOTHER_MOCK_LOAD_CHILDREN,
            },
            { path: "bull", component: AnotherMockComponent },
        ];

        const expectations = [
            ...additionalExpectedRoutes.map((route) => ({
                ...route,
                children: undefined,
            })),
            ...featureFlagRoutes.map((route) => ({
                ...route,
                children: undefined,
            })),
        ];

        expect(TestBed.inject(Router).config).toStrictEqual(expectations);

        expect(TestBed.inject(ROUTES)).toStrictEqual([[], expectations]);
    });
});
