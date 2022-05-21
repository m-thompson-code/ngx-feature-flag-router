import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiFeatureFlagOnComponent } from './api-feature-flag-on.component';

describe('ApiFeatureFlagOnComponent', () => {
    let component: ApiFeatureFlagOnComponent;
    let fixture: ComponentFixture<ApiFeatureFlagOnComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApiFeatureFlagOnComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApiFeatureFlagOnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
