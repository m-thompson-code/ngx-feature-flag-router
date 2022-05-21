import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiExampleComponent } from './api-example.component';

describe('ApiExampleComponent', () => {
    let component: ApiExampleComponent;
    let fixture: ComponentFixture<ApiExampleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApiExampleComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApiExampleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
