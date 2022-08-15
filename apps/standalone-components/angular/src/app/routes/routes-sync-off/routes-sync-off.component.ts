import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'standalone-components-routes-sync-off',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './routes-sync-off.component.html',
    styleUrls: ['./routes-sync-off.component.scss'],
})
export class RoutesSyncOffComponent {}
