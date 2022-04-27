import { Injectable } from '@angular/core';
import { FeatureFlagRoutes, FeatureFlagRoutesService } from 'ngx-feature-flag-router';
import { BehaviorSubject, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class MyService implements FeatureFlagRoutesService {
    readonly asyncFlag$ = new BehaviorSubject<boolean>(false);

    getFeatureRoutes(): FeatureFlagRoutes {
        return [
            {
                path: 'async',
                loadChildren: () => import('./async-off/async-off.module').then((m) => m.AsyncOffModule),
                alternativeLoadChildren: () => import('./async-on/async-on.module').then((m) => m.AsyncOnModule),
                featureFlag: () => timer(5000).pipe(mergeMap(() => this.asyncFlag$)),
            },
        ];
    }
}
