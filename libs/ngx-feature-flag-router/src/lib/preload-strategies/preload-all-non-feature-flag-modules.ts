import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FeatureFlagRoute } from '../models';

@Injectable()
export class PreloadAllNonFeatureFlagModules implements PreloadingStrategy {
    preload(route: Partial<FeatureFlagRoute> & Route, fn: () => Observable<any>): Observable<any> {
        // Check if possible FeatureFlagRoute has required properties
        // to involve lazy-loading modules based on FeatureFlag
        if (route.alternativeLoadChildren && route.featureFlag) {
            return of(null);
        }

        // If not, call fn to load Module asap
        // source: https://github.com/angular/angular/blob/14.0.x/packages/router/src/router_preloader.ts#L43
        return fn().pipe(catchError(() => of(null)));
    }
}
