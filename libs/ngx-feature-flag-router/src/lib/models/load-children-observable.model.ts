import { LoadChildrenCallback } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * A subset of LoadChildrenCallback that only includes Module-related types.
 *
 * This avoids types involving Routes that are introduced in Angular 14
 */
export type LoadChildrenObservableCallback = () => Extract<ReturnType<LoadChildrenCallback>, Observable<any>>;
