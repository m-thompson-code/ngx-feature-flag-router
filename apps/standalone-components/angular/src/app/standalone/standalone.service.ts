import { Injectable } from '@angular/core';
import { FeatureFlagRoutes, FeatureFlagRoutesService } from 'ngx-feature-flag-router';
import { BehaviorSubject, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class StandaloneService implements FeatureFlagRoutesService {
    readonly asyncFlag$ = new BehaviorSubject<boolean>(false);

    getFeatureRoutes(): FeatureFlagRoutes {
        return [
            {
                path: 'async',
                loadComponent: () =>
                    import('../standalone/standalone-async-off/standalone-async-off.component').then((m) => m.StandaloneAsyncOffComponent),
                alternativeLoadComponent: () =>
                    import('../standalone/standalone-async-on/standalone-async-on.component').then((m) => m.StandaloneAsyncOnComponent),
                featureFlag: () => timer(1000).pipe(mergeMap(() => this.asyncFlag$)),
            },
        ];
    }
}
