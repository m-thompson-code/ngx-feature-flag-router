import { ɵisObservable as isObservable, ɵisPromise as isPromise } from '@angular/core';
import { from, Observable, of } from 'rxjs';

/**
 * `wrapIntoObservable` from
 * [angular/packages/router/src/utils/collection.ts](https://github.com/angular/angular/blob/master/packages/router/src/utils/collection.ts)
 *
 * Since angular doesn't export this function, here is a copy of it using version 13.2.x
 *
 * Wrap Promise / Observable / syncronous value with an Observable
 */
export function wrapIntoObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
    if (isObservable(value)) {
        return value;
    }

    if (isPromise(value)) {
        // Use `Promise.resolve()` to wrap promise-like instances.
        // Required ie when a Resolver returns a AngularJS `$q` promise to correctly trigger the
        // change detection.
        return from(Promise.resolve(value));
    }

    return of(value);
}
