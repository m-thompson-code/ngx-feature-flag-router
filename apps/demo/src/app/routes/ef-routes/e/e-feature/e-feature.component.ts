import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: "demo-e-feature",
    templateUrl: "./e-feature.component.html",
    styleUrls: ["./e-feature.component.scss"],
})
export class EFeatureComponent {
    readonly id$: Observable<string>;

    constructor(private readonly route: ActivatedRoute) {
        this.id$ = this.route.params.pipe(map((params) => params["id"]));
    }
}
