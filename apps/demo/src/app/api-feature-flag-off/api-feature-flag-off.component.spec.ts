import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiFeatureFlagOffComponent } from './api-feature-flag-off.component';

describe('ApiFeatureFlagOffComponent', () => {
    let component: ApiFeatureFlagOffComponent;
    let fixture: ComponentFixture<ApiFeatureFlagOffComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApiFeatureFlagOffComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApiFeatureFlagOffComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
