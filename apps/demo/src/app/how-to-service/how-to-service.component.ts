import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { HighlightService } from '../services/highlight/highlight.service';

@Component({
    selector: 'demo-how-to-service',
    templateUrl: './how-to-service.component.html',
    styleUrls: ['./how-to-service.component.scss'],
})
export class HowToServiceComponent implements AfterViewInit {
    moduleSample = `
import { FeatureFlagRouterModule, FeatureFlagRoutes } from 'ngx-feature-flag-router';

// Initialize routes that don't require Service
const routes: FeatureFlagRoutes = [/*...*/];

@NgModule({
    imports: [FeatureFlagRouterModule.forChild(routes, MyService)]
})
export class MyModule {}
    `.trim();

    implementsSample = `
@Injectable({ providedIn: 'root' })
export class FeatureFlagService implements FeatureFlagRoutesService {
    // ...
}
        `.trim();

    getFeatureRoutesSample = `
@Injectable({ providedIn: 'root' })
export class FeatureFlagService implements FeatureFlagRoutesService {
    // Get current user id
    private readonly userId$: Observable<number> = this.getUserId();

    constructor(private readonly httpClient: HttpClient) {}

    /** Set additional routes using Service */
    getFeatureRoutes(): FeatureFlagRoutes {
        return [
            {
                path: 'api-example',
                loadChildren: () => import('api-feature-flag-off.module').then((m) => m.ApiFeatureFlagOffModule),
                alternativeLoadChildren: () => import('api-feature-flag-on.module').then((m) => m.ApiFeatureFlagOnModule),
                featureFlag: () => this.showFeature(),// Function that returns Observable<boolean>
            }
        ];
    }

    /** Determine showing feature based on user id and API response */
    showFeature(): Observable<boolean> {
        // Use current user id
        return this.userId$.pipe(
            switchMap(userId => {
                // Make specific request for that user
                return this.httpClient.get<UserStatus>('some/api');
            }),
            map(userStatus => {
                // Check if we want to turn feature flag on or not
                return userStatus.authorized;
            }),
            // Replay results until user id changes if you only want to make the api request once
            shareReplay({ bufferSize: 1, refCount: true })
        );
    }
}
`.trim();

    constructor(
        private readonly elementRef: ElementRef,
        private readonly highlightService: HighlightService,
    ) {}

    ngAfterViewInit(): void {
        this.highlightService.highlight(this.elementRef.nativeElement);
    }
}
