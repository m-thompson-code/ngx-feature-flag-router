import { Injectable } from '@angular/core';
import { FeatureFlagRoutes, FeatureFlagRoutesService } from 'ngx-feature-flag-router';
import { BehaviorSubject, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RoutesService implements FeatureFlagRoutesService {
    readonly asyncFlag$ = new BehaviorSubject<boolean>(false);

    getFeatureRoutes(): FeatureFlagRoutes {
        return [
            {
                path: 'async',
                loadChildren: () => import('./routes-async-off/routes-async-off.routes').then((m) => m.routes),
                alternativeLoadChildren: () => import('./routes-async-on/routes-async-on.routes').then((m) => m.routes),
                featureFlag: () => timer(1000).pipe(mergeMap(() => this.asyncFlag$)),
            },
        ];
    }
}
