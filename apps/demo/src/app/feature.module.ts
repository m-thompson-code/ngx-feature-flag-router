import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from './feature/feature.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: FeatureComponent,
    },
];

@NgModule({
    declarations: [FeatureComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class FeatureModule {}
