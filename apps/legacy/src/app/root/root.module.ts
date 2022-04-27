import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureFlagRoutes, FeatureFlagRouterModule } from 'ngx-feature-flag-router';
import { MyService } from '../my.service';
import { RootComponent } from './root.component';

const routes: FeatureFlagRoutes = [
    {
        path: '',
        component: RootComponent,
    },
    {
        path: 'sync',
        loadChildren: () => import('../sync-off/sync-off.module').then((m) => m.SyncOffModule),
        alternativeLoadChildren: () => import('../sync-on/sync-on.module').then((m) => m.SyncOnModule),
        featureFlag: () => (window as any).__sync_feature_flag_state__ || false,
    },
];

@NgModule({
    declarations: [RootComponent],
    imports: [CommonModule, FeatureFlagRouterModule.forChild(routes, MyService)],
})
export class RootModule {}
