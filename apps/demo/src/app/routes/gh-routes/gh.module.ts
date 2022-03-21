import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { map } from 'rxjs/operators';
import { FeatureFlagRoutes, FeatureFlagRouterModule, FeatureFlagRoutesService } from 'ngx-feature-flag-router';
import { DemoRoute, FeatureFlag } from 'demo-storage';

import { FeatureFlagService } from '../../services/feature-flag/feature-flag.service';
import { CanActivateGuard } from '../../can-activate.guard';

const routes: Routes = [
    {
        path: 'g/:id',
        loadChildren: () => import('./g/g.module').then((m) => m.GModule),
    },
    {
        path: 'h/:id',
        loadChildren: () => import('./h/h.module').then((m) => m.HModule),
    },
];

@Injectable({
    providedIn: 'root',
})
class FeatureFlagRoutesExample implements FeatureFlagRoutesService {
    constructor(private readonly configService: FeatureFlagService) {}

    getFeatureRoutes(): FeatureFlagRoutes {
        return [
            {
                path: 'g/:id',
                featureFlag: () => this.configService.getConfig(DemoRoute.G).pipe(map((config) => config === FeatureFlag.ON)),
                loadChildren: () => import('./g/g.module').then((m) => m.GModule),
                alternativeLoadChildren: () => import('./g-feature/g-feature.module').then((m) => m.GFeatureModule),
                canActivate: [CanActivateGuard],
                canActivateChild: [CanActivateGuard],
                canLoad: [CanActivateGuard],
            },
        ];
    }
}

@NgModule({
    declarations: [],
    imports: [CommonModule, FeatureFlagRouterModule.forChild(routes, FeatureFlagRoutesExample)],
})
export class GHModule {}
