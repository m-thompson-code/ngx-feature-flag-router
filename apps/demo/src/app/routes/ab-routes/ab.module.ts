import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureFlagRoutes, FeatureFlagRouterModule } from 'ngx-feature-flag-router';
import { getFeatureFlagValue, FeatureFlag, DemoRoute } from 'demo-storage';
import { CanActivateGuard } from '../../can-activate.guard';

const routes: FeatureFlagRoutes = [
    {
        path: 'a/:id',
        loadChildren: () => import('./a/a.module').then((m) => m.AModule),
        alternativeLoadChildren: () => import('./a-feature/a-feature.module').then((m) => m.AFeatureModule),
        featureFlag: () => getFeatureFlagValue(DemoRoute.A) === FeatureFlag.ON,
        canActivate: [CanActivateGuard],
        canActivateChild: [CanActivateGuard],
        canLoad: [CanActivateGuard],
    },
    {
        path: 'b/:id',
        loadChildren: () => import('./b/b.module').then((m) => m.BModule),
    },
];

@NgModule({
    imports: [CommonModule, FeatureFlagRouterModule.forChild(routes)],
})
export class ABModule {}
