import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncOnComponent } from './sync-on.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: SyncOnComponent,
    },
];

@NgModule({
    declarations: [SyncOnComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SyncOnModule {}
