import { NgModule } from "@angular/core";
import { DemoRoute, FeatureFlag, getFeatureFlagValue } from "demo-storage";
import { FeatureFlagRoutes, FeatureFlagRouterModule } from "ngx-feature-flag-router";
import { ExampleComponent } from "../example/example.component";
import { HomeComponent } from "../home/home.component";
import { HowToComponent } from "../how-to/how-to.component";
import { RootComponent } from "./root.component";
import { MoreExamplesComponent } from "../more-examples/more-examples.component";
import { CommonModule } from "@angular/common";

const showFeature = () => {
    return getFeatureFlagValue(DemoRoute.HELLO_WORLD) === FeatureFlag.ON;
};

const routes: FeatureFlagRoutes = [
    {
        path: "",
        component: RootComponent,
    },
    {
        path: "hello-world",
        loadChildren: () => import("../hello-world.module").then((m) => m.HelloWorldModule),
        alternativeLoadChildren: () => import("../feature.module").then((m) => m.FeatureModule),
        featureFlag: () => showFeature(),
    },
];

@NgModule({
    declarations: [RootComponent, HomeComponent, HowToComponent, ExampleComponent, MoreExamplesComponent],
    imports: [CommonModule, FeatureFlagRouterModule.forChild(routes)],
    exports: [FeatureFlagRouterModule],
})
export class RootModule {}
