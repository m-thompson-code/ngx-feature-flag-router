import { TestBed } from "@angular/core/testing";

import { ProvidedService } from "./provided.service";

describe("ProvidedService", () => {
    let service: ProvidedService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProvidedService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
