import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadableComponent } from './preloadable.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: PreloadableComponent,
    },
];

@NgModule({
    declarations: [PreloadableComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PreloadableModule {}
