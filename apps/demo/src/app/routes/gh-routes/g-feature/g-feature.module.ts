import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GFeatureComponent } from './g-feature.component';

const routes: Routes = [
    {
        path: '',
        component: GFeatureComponent,
    },
];

@NgModule({
    declarations: [GFeatureComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class GFeatureModule {}
