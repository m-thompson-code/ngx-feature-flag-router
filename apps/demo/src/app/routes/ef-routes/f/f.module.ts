import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FComponent } from './f.component';

const routes: Routes = [
    {
        path: '',
        component: FComponent,
    },
];

@NgModule({
    declarations: [FComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class FModule {}
