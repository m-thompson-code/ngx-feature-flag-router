import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureFlagRouterModule, FeatureFlagRoutes } from 'ngx-feature-flag-router';
import { StandaloneRootComponent } from './standalone-root.component';
import { StandaloneService } from '../standalone.service';

export const routes: FeatureFlagRoutes = [
    {
        path: '',
        component: StandaloneRootComponent,
    },
    {
        path: 'sync',
        loadComponent: () => import('../standalone-sync-off/standalone-sync-off.component').then((m) => m.StandaloneSyncOffComponent),
        alternativeLoadComponent: () =>
            import('../standalone-sync-on/standalone-sync-on.component').then((m) => m.StandaloneSyncOnComponent),
        featureFlag: () => (window as { __sync_feature_flag_state__?: boolean }).__sync_feature_flag_state__ || false,
    },
];

@NgModule({
    declarations: [StandaloneRootComponent],
    imports: [CommonModule, FeatureFlagRouterModule.forChild(routes, StandaloneService)],
})
export class StandaloneRootModule {}
