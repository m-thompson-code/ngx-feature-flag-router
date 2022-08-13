import { LoadChildrenCallback } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * A subset of LoadChildrenCallbacks that involve Observables.
 *
 * Ignores return types such as `Routes` for Angular 14 and
 * `string` for Angular 9
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LoadChildrenObservableCallback = () => Extract<ReturnType<LoadChildrenCallback>, Observable<any>>;
