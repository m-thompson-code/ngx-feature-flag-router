import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FeatureFlag, DemoRoute } from 'demo-storage';
import { Subject } from 'rxjs';
import { FeatureFlagService } from './services/feature-flag/feature-flag.service';

@Component({
    selector: 'demo-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    readonly form: FormGroup;

    private readonly unsubscribe$ = new Subject<void>();

    readonly FeatureFlag = FeatureFlag;
    readonly DemoRoute = DemoRoute;

    // Inject FeatureFlagService to start fetching api request asap
    constructor(private readonly configService: FeatureFlagService, private readonly fb: FormBuilder, private readonly router: Router) {
        this.form = this.fb.group({
            id: [],
        });
    }

    setFeatureFlag(route: DemoRoute, value: FeatureFlag): void {
        this.configService.setConfig(route, value);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
