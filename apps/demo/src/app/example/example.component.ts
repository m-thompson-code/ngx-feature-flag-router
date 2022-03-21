import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { DemoRoute, FeatureFlag, getFeatureFlagValue, setFeatureFlagValue } from 'demo-storage';
import { HighlightService } from '../services/highlight/highlight.service';

@Component({
    selector: 'demo-example',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.scss'],
})
export class ExampleComponent implements AfterViewInit {
    featureFlag: FeatureFlag;

    readonly FeatureFlag = FeatureFlag;

    constructor(private readonly elementRef: ElementRef, private readonly highlightService: HighlightService) {
        this.featureFlag = getFeatureFlagValue(DemoRoute.HELLO_WORLD);
    }

    ngAfterViewInit(): void {
        this.highlightService.highlight(this.elementRef.nativeElement);
    }

    turnFeatureFlagOn(): void {
        setFeatureFlagValue(DemoRoute.HELLO_WORLD, FeatureFlag.ON);
        this.featureFlag = getFeatureFlagValue(DemoRoute.HELLO_WORLD);
    }

    turnFeatureFlagOff(): void {
        setFeatureFlagValue(DemoRoute.HELLO_WORLD, FeatureFlag.OFF);
        this.featureFlag = getFeatureFlagValue(DemoRoute.HELLO_WORLD);
    }
}
