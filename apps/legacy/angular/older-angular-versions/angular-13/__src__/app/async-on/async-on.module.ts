import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncOnComponent } from './async-on.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: AsyncOnComponent,
    },
];

@NgModule({
    declarations: [AsyncOnComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AsyncOnModule {}
