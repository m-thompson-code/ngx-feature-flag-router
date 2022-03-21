import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: "demo-e",
    templateUrl: "./e.component.html",
    styleUrls: ["./e.component.scss"],
})
export class EComponent {
    readonly id$: Observable<string>;

    constructor(private readonly route: ActivatedRoute) {
        this.id$ = this.route.params.pipe(map((params) => params["id"]));
    }
}
