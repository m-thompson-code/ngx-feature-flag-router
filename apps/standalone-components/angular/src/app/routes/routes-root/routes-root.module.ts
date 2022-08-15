import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureFlagRouterModule, FeatureFlagRoutes } from 'ngx-feature-flag-router';
import { RoutesRootComponent } from './routes-root.component';
import { RoutesService } from '../routes.service';

export const routes: FeatureFlagRoutes = [
    {
        path: '',
        component: RoutesRootComponent,
    },
    {
        path: 'sync',
        loadChildren: () => import('../routes-sync-off/routes-sync-off.routes').then((m) => m.routes),
        alternativeLoadChildren: () => import('../routes-sync-on/routes-sync-on.routes').then((m) => m.routes),
        featureFlag: () => (window as { __sync_feature_flag_state__?: boolean }).__sync_feature_flag_state__ || false,
    },
];

@NgModule({
    declarations: [RoutesRootComponent],
    imports: [CommonModule, FeatureFlagRouterModule.forChild(routes, RoutesService)],
})
export class RoutesRootModule {}
