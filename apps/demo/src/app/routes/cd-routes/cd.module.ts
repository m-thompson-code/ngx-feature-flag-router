import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'c/:id',
        loadChildren: () => import('./c/c.module').then((m) => m.CModule),
    },
    {
        path: 'd/:id',
        loadChildren: () => import('./d/d.module').then((m) => m.DModule),
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CDModule {}
