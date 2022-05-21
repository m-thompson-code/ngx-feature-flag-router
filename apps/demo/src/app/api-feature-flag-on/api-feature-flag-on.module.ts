import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiFeatureFlagOnComponent } from './api-feature-flag-on.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: ApiFeatureFlagOnComponent,
    }
];

@NgModule({
    declarations: [ApiFeatureFlagOnComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ApiFeatureFlagOnModule {}
