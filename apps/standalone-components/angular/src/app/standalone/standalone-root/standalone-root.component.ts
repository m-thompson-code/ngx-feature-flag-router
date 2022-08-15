import { Component, inject } from '@angular/core';
import { StandaloneService } from '../standalone.service';

@Component({
    selector: 'standalone-components-root',
    templateUrl: './standalone-root.component.html',
    styleUrls: ['./standalone-root.component.scss'],
})
export class StandaloneRootComponent {
    private readonly routesService = inject(StandaloneService);

    setSync(state: boolean): void {
        window.__sync_feature_flag_state__ = state;
    }

    setAsync(state: boolean): void {
        this.routesService.asyncFlag$.next(state);
    }
}
