import { Component, inject } from '@angular/core';
import { RoutesService } from '../routes.service';

@Component({
    selector: 'standalone-components-routes-root',
    templateUrl: './routes-root.component.html',
    styleUrls: ['./routes-root.component.scss'],
})
export class RoutesRootComponent {
    private readonly routesService = inject(RoutesService);

    setSync(state: boolean): void {
        window.__sync_feature_flag_state__ = state;
    }

    setAsync(state: boolean): void {
        this.routesService.asyncFlag$.next(state);
    }
}
