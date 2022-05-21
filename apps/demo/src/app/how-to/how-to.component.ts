import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { HighlightService } from '../services/highlight/highlight.service';

@Component({
    selector: 'demo-how-to',
    templateUrl: './how-to.component.html',
    styleUrls: ['./how-to.component.scss'],
})
export class HowToComponent implements AfterViewInit {
    beforeModuleSample = `
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [/*...*/];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class MyModule {}
    `.trim();

    afterModuleSample = `
import { FeatureFlagRouterModule, FeatureFlagRoutes } from 'ngx-feature-flag-router';

const routes: FeatureFlagRoutes = [/*...*/];

@NgModule({
    imports: [FeatureFlagRouterModule.forChild(routes)]
})
export class MyModule {}
    `.trim();

    beforeRoutesSample = `
const routes: Routes = [
    {
        path: 'hello-world',
        loadChildren: () => import('./hello-world.module').then((m) => m.HelloWorldModule),
    }
]
        `.trim();

    afterRoutesSample = `
const routes: FeatureFlagRoutes = [
    {
        path: 'hello-world',
        loadChildren: () => import('./hello-world.module').then((m) => m.HelloWorldModule),
        alternativeLoadChildren: () => import('./feature.module').then((m) => m.FeatureModule),
        featureFlag: () => showFeature(),// Function that returns boolean
    }
]
        `.trim();

    constructor(
        private readonly elementRef: ElementRef,
        private readonly highlightService: HighlightService,
    ) {}

    ngAfterViewInit(): void {
        this.highlightService.highlight(this.elementRef.nativeElement);
    }
}
