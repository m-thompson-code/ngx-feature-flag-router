import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'standalone-components-async-off',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './standalone-async-off.component.html',
    styleUrls: ['./standalone-async-off.component.scss'],
})
export class StandaloneAsyncOffComponent {}
