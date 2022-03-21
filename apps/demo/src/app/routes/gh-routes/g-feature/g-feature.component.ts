import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'demo-g-feature',
    templateUrl: './g-feature.component.html',
    styleUrls: ['./g-feature.component.scss'],
})
export class GFeatureComponent {
    readonly id$: Observable<string>;

    constructor(private readonly route: ActivatedRoute) {
        this.id$ = this.route.params.pipe(map((params) => params['id']));
    }
}
