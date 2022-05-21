import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiFeatureFlagOffComponent } from './api-feature-flag-off.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: ApiFeatureFlagOffComponent,
    }
];

@NgModule({
    declarations: [ApiFeatureFlagOffComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ApiFeatureFlagOffModule {}
