import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { FeatureFlagRoute } from '../models';
import { PreloadAllNonFeatureFlagModules } from './preload-all-non-feature-flag-modules';

@NgModule()
class MooModule {}

describe('PreloadAllNonFeatureFlagModules', () => {
    let service: PreloadAllNonFeatureFlagModules;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PreloadAllNonFeatureFlagModules
            ]
        });

        service = TestBed.inject(PreloadAllNonFeatureFlagModules);
    });

    describe('preload()', () => {
        it('should return Observable of null when Route has FeatureFlagRoute properties', (done) => {
            expect.assertions(1);

            const result = service.preload(
                { alternativeLoadChildren: () => MooModule, featureFlag: () => true } as FeatureFlagRoute, 
                () => of('moo'),
            );

            result.subscribe(result => {
                expect(result).toBeNull();
                done();
            });
        });

        it('should return fn callback Observable if Route doesn\t have FeatureFlagRoute properties', (done) => {
            expect.assertions(1);

            const result = service.preload(
                {} as FeatureFlagRoute, 
                () => of('moo'),
            );

            result.subscribe(result => {
                expect(result).toBe('moo');
                done();
            });
        });

        it('should return null if fn callback errors', (done) => {
            expect.assertions(1);

            const result = service.preload(
                {} as FeatureFlagRoute, 
                () => throwError(() => new Error('cow')),
            );

            result.subscribe(result => {
                expect(result).toBeNull();
                done();
            });
        });
    });
});
