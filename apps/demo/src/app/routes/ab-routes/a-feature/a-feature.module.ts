import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AFeatureComponent } from './a-feature.component';

const routes: Routes = [
    {
        path: '',
        component: AFeatureComponent,
    },
];

@NgModule({
    declarations: [AFeatureComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AFeatureModule {}
