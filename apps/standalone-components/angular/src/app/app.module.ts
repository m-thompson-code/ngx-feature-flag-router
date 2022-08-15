import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

const routes: Routes = [
    {
        path: 'routes',
        loadChildren: () => import('./routes/routes-root/routes-root.module').then((m) => m.RoutesRootModule),
    },
    {
        path: 'standalone',
        loadChildren: () => import('./standalone/standalone-root/standalone-root.module').then((m) => m.StandaloneRootModule),
    },
];

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, RouterModule.forRoot(routes)],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
