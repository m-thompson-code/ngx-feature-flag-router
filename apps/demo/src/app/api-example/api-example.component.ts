import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { FeatureFlag } from 'demo-storage';
import { FeatureFlagService } from '../services/feature-flag/feature-flag.service';
import { HighlightService } from '../services/highlight/highlight.service';

@Component({
    selector: 'demo-api-example',
    templateUrl: './api-example.component.html',
    styleUrls: ['./api-example.component.scss'],
})
export class ApiExampleComponent implements AfterViewInit {
    userId$ = this.featureFlagService.getUserId();

    readonly FeatureFlag = FeatureFlag;

    constructor(
        private readonly elementRef: ElementRef,
        private readonly highlightService: HighlightService,
        private readonly featureFlagService: FeatureFlagService,
    ) {}

    ngAfterViewInit(): void {
        this.highlightService.highlight(this.elementRef.nativeElement);
    }

    turnFeatureFlag(featureFlag: FeatureFlag): void {
        this.featureFlagService.setUserId(featureFlag === FeatureFlag.ON ? 1 : 0);
    }
}
