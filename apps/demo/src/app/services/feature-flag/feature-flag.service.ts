import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DemoRoute, FeatureFlag, getFeatureFlagValue, setFeatureFlagValue } from 'demo-storage';
import { FeatureFlagRoutes, FeatureFlagRoutesService } from 'ngx-feature-flag-router';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators';

interface UserStatus { authorized: boolean }

@Injectable({ providedIn: 'root' })
export class FeatureFlagService implements FeatureFlagRoutesService {
    private readonly userId$ = new BehaviorSubject<number>(this.getInitialUserId());

    constructor(private readonly httpClient: HttpClient) {}

    /** Determine showing feature based on user id and API response */
    showFeature(): Observable<boolean> {
        // Get current user id
        return this.userId$.pipe(
            distinctUntilChanged(),
            switchMap(userId => {
                // Make specific request for that user
                return this.httpClient.get<UserStatus>(`assets/feature-flag/${userId}/permissions.json`)
            }),
            map(userStatus => {
                // Check if we want to turn feature flag on or not
                return !!userStatus?.authorized;
            }),
            // Replay results until user id changes if you only want to make the api request once
            shareReplay({ bufferSize: 1, refCount: true })
        );
    }

    getInitialUserId(): number {
        const featureFlag = getFeatureFlagValue(DemoRoute.API_EXAMPLE);
        return featureFlag === FeatureFlag.ON ? 1 : 0;
    }

    setUserId(userId: number): void {
        setFeatureFlagValue(DemoRoute.API_EXAMPLE, userId ? FeatureFlag.ON : FeatureFlag.OFF);

        this.userId$.next(userId);
    }

    getUserId(): Observable<number> {
        return this.userId$.asObservable();
    }

    /** Set additional routes using Service */
    getFeatureRoutes(): FeatureFlagRoutes {
        return [
            {
                path: 'api-example',
                loadChildren: () => import('../../api-feature-flag-off/api-feature-flag-off.module').then((m) => m.ApiFeatureFlagOffModule),
                alternativeLoadChildren: () => import('../../api-feature-flag-on/api-feature-flag-on.module').then((m) => m.ApiFeatureFlagOnModule),
                featureFlag: () => this.showFeature(),// Function that returns Observable<boolean>
            }
        ];
    }
}
