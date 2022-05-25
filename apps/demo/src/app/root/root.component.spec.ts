import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootComponent } from './root.component';

@Component({
    selector: 'demo-home',
    template: '',
})
class MockDemoHomeComponent {}

@Component({
    selector: 'demo-how-to',
    template: '',
})
class MockDemoHowToComponent {}

@Component({
    selector: 'demo-example',
    template: '',
})
class MockDemoExampleComponent {}

@Component({
    selector: 'demo-api-example',
    template: '',
})
class MockDemoApiExampleComponent {}

@Component({
    selector: 'demo-more-examples',
    template: '',
})
class MockDemoExamplesComponent {}

describe('RootComponent', () => {
    let component: RootComponent;
    let fixture: ComponentFixture<RootComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                RootComponent,
                MockDemoHomeComponent,
                MockDemoHowToComponent,
                MockDemoExampleComponent,
                MockDemoApiExampleComponent,
                MockDemoExamplesComponent,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RootComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
