import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./root/root.module').then((m) => m.RootModule),
    },
];

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
