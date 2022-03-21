import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HComponent } from './h.component';

const routes: Routes = [
    {
        path: '',
        component: HComponent,
    },
];

@NgModule({
    declarations: [HComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class HModule {}
