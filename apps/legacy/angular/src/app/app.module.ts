import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PreloadAllNonFeatureFlagModules } from 'ngx-feature-flag-router';

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
    imports: [
        // Typescript tries to import BrowserModule from older versions of angular due to nested
        // node_modules, this error can be ignored
        BrowserModule,
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllNonFeatureFlagModules,
        }),
    ],
    exports: [RouterModule],
    providers: [PreloadAllNonFeatureFlagModules],
    bootstrap: [AppComponent],
})
export class AppModule {}
