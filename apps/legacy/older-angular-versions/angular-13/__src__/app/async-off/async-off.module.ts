import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncOffComponent } from './async-off.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: AsyncOffComponent,
    },
];

@NgModule({
    declarations: [AsyncOffComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AsyncOffModule {}
