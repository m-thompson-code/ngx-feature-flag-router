import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'standalone-components-async-on',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './standalone-async-on.component.html',
    styleUrls: ['./standalone-async-on.component.scss'],
})
export class StandaloneAsyncOnComponent {}
