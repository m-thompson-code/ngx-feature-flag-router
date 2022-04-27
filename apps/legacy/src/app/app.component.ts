import { Component } from '@angular/core';
import { MyService } from './my.service';

@Component({
    selector: 'legacy-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private readonly myService: MyService) {}

    setSync(state: boolean): void {
        (window as any).__sync_feature_flag_state__ = state;
    }

    setAsync(state: boolean): void {
        this.myService.asyncFlag$.next(state);
    }
}
