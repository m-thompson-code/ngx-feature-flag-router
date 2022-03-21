import { TestBed } from "@angular/core/testing";
import { DefaultFeatureFlagRoutesService } from "./default-feature-flag-routes.service";

describe("DefaultFeatureFlagRoutesService", () => {
    it("should have method getFeatureRoutes() that returns empty Array", () => {
        TestBed.configureTestingModule({
            providers: [DefaultFeatureFlagRoutesService],
        });

        const service = TestBed.inject(DefaultFeatureFlagRoutesService);

        expect(service.getFeatureRoutes()).toStrictEqual([]);
    });
});
