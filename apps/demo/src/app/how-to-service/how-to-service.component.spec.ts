import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToServiceComponent } from './how-to-service.component';

describe('HowToServiceComponent', () => {
    let component: HowToServiceComponent;
    let fixture: ComponentFixture<HowToServiceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HowToServiceComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HowToServiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
