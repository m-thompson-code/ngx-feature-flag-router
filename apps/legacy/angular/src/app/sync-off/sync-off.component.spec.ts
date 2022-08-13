import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncOffComponent } from './sync-off.component';

describe('SyncOffComponent', () => {
    let component: SyncOffComponent;
    let fixture: ComponentFixture<SyncOffComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SyncOffComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SyncOffComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
