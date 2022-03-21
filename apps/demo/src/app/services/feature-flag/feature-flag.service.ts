import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { merge, Observable, Subject } from "rxjs";
import { delay, map, shareReplay, tap } from "rxjs/operators";
import { getFeatureFlagValue, setFeatureFlagValue, FeatureFlag, DemoRoute } from "demo-storage";

@Injectable({ providedIn: "root" })
export class FeatureFlagService {
    private overrides: Partial<Record<DemoRoute, Subject<FeatureFlag>>> = {};
    private configApiResponses: Partial<Record<DemoRoute, Observable<FeatureFlag>>> = {};

    constructor(private readonly httpClient: HttpClient) {}

    private getOverride(route: DemoRoute): Subject<FeatureFlag> {
        this.overrides[route] = this.overrides[route] || new Subject<FeatureFlag>();

        return this.overrides[route]!;
    }

    getConfig(route: DemoRoute): Observable<FeatureFlag> {
        const url = `https://jsonplaceholder.typicode.com/todos/1?feature_flag=${route}`;

        this.configApiResponses[route] =
            this.configApiResponses[route] ||
            this.httpClient.get(url).pipe(
                delay(10 * 1000),
                map(() => this.getConfigSync(route)),
                tap((featureFlag) => this.setConfig(route, featureFlag)),
                shareReplay(1),
            );

        return merge(this.configApiResponses[route]!, this.getOverride(route));
    }

    getConfigSync(route: DemoRoute): FeatureFlag {
        return getFeatureFlagValue(route);
    }

    setConfig(route: DemoRoute, featureFlag: FeatureFlag): void {
        setFeatureFlagValue(route, featureFlag);

        this.getOverride(route).next(featureFlag);
    }
}
