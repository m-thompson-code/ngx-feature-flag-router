import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowToServiceComponent } from './how-to-service.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: HowToServiceComponent,
    },
];

@NgModule({
    declarations: [HowToServiceComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class HowToServiceModule {}
