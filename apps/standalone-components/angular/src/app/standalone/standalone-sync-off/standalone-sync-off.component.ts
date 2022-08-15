import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'standalone-components-sync-off',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './standalone-sync-off.component.html',
    styleUrls: ['./standalone-sync-off.component.scss'],
})
export class StandaloneSyncOffComponent {}
