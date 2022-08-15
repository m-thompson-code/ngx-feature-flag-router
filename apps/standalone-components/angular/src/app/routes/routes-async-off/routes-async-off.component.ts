import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'standalone-components-routes-async-off',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './routes-async-off.component.html',
    styleUrls: ['./routes-async-off.component.scss'],
})
export class RoutesAsyncOffComponent {}
