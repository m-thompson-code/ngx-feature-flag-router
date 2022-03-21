import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { FeatureFlagRouterModule } from 'ngx-feature-flag-router';

import { IFeatureComponent } from './i-feature.component';

const routes: Routes = [
    {
        path: '',
        component: IFeatureComponent,
        children: [
            {
                path: 'ij',
                loadChildren: () => import('../ij.module').then((m) => m.IJModule),
            },
        ],
    },
];

@NgModule({
    declarations: [IFeatureComponent],
    imports: [CommonModule, FeatureFlagRouterModule.forChild(routes)],
})
export class IFeatureModule {}
