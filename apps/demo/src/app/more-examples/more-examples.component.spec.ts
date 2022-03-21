import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MoreExamplesComponent } from "./more-examples.component";

describe("MoreExamplesComponent", () => {
    let component: MoreExamplesComponent;
    let fixture: ComponentFixture<MoreExamplesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MoreExamplesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MoreExamplesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
