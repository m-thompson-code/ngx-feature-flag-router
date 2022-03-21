import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeatureFlagRouterModule, FeatureFlagRoutes } from "ngx-feature-flag-router";
import { DemoRoute, FeatureFlag, getFeatureFlagValue } from "demo-storage";

const routes: FeatureFlagRoutes = [
    {
        path: "i/:id",
        featureFlag: () => getFeatureFlagValue(DemoRoute.I) === FeatureFlag.ON,
        loadChildren: () => import("./i/i.module").then((m) => m.IModule),
        alternativeLoadChildren: () => import("./i-feature/i-feature.module").then((m) => m.IFeatureModule),
    },
    {
        path: "j/:id",
        loadChildren: () => import("./j/j.module").then((m) => m.JModule),
    },
];

@NgModule({
    imports: [CommonModule, FeatureFlagRouterModule.forChild(routes)],
})
export class IJModule {}
