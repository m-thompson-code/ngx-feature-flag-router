import { isObservable, of } from 'rxjs';
import { wrapIntoObservable } from './wrap-into-observable';

describe('wrapIntoObservable()', () => {
    it('should return Observable as is', (done) => {
        expect.assertions(2);

        const result = wrapIntoObservable(of('moo'));

        expect(isObservable(result)).toBe(true);
        result.subscribe((x) => {
            expect(x).toBe('moo');
            done();
        });
    });

    it('should return converted Promise to Observable', (done) => {
        expect.assertions(2);

        const result = wrapIntoObservable(Promise.resolve('moo'));

        expect(isObservable(result)).toBe(true);
        result.subscribe((x) => {
            expect(x).toBe('moo');
            done();
        });
    });

    it('should return value wrapped with Observable is not already an Observable or Promise', (done) => {
        expect.assertions(2);

        const result = wrapIntoObservable('moo');

        expect(isObservable(result)).toBe(true);
        result.subscribe((x) => {
            expect(x).toBe('moo');
            done();
        });
    });
});
