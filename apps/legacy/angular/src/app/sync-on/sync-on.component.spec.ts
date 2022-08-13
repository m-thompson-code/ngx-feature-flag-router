import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncOnComponent } from './sync-on.component';

describe('SyncOnComponent', () => {
    let component: SyncOnComponent;
    let fixture: ComponentFixture<SyncOnComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SyncOnComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SyncOnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
