import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: "demo-i-feature",
    templateUrl: "./i-feature.component.html",
    styleUrls: ["./i-feature.component.scss"],
})
export class IFeatureComponent {
    readonly id$: Observable<string>;

    constructor(private readonly route: ActivatedRoute) {
        this.id$ = this.route.params.pipe(map((params) => params["id"]));
    }
}
