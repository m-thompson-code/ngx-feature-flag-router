import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncOffComponent } from './sync-off.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: SyncOffComponent,
    },
];

@NgModule({
    declarations: [SyncOffComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SyncOffModule {}
