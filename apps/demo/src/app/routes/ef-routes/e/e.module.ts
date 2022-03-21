import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeatureFlagRouterModule, FeatureFlagRoutes } from "ngx-feature-flag-router";

import { EComponent } from "./e.component";
import { DemoRoute, FeatureFlag, getFeatureFlagValue } from "demo-storage";

const routes: FeatureFlagRoutes = [
    {
        path: "",
        component: EComponent,
    },

    {
        path: "feature",
        featureFlag: () => getFeatureFlagValue(DemoRoute.E) === FeatureFlag.ON,
        loadChildren: () => import("../../not-found/not-found.module").then((m) => m.NotFoundModule),
        alternativeLoadChildren: () => import("./e-feature/e-feature.module").then((m) => m.EFeatureModule),
    },
];

@NgModule({
    declarations: [EComponent],
    imports: [CommonModule, FeatureFlagRouterModule.forChild(routes)],
})
export class EModule {}
