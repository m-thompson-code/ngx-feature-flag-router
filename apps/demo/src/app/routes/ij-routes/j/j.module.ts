import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { FeatureFlagRouterModule } from 'ngx-feature-flag-router';

import { JComponent } from './j.component';

const routes: Routes = [
    {
        path: '',
        component: JComponent,
        children: [
            {
                path: 'ij',
                loadChildren: () => import('../ij.module').then((m) => m.IJModule),
            },
        ],
    },
];

@NgModule({
    declarations: [JComponent],
    imports: [CommonModule, FeatureFlagRouterModule.forChild(routes)],
})
export class JModule {}
