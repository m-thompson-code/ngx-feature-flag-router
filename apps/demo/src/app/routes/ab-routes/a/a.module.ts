import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AComponent } from "./a.component";

const routes: Routes = [
    {
        path: "",
        component: AComponent,
    },
];

@NgModule({
    declarations: [AComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AModule {}
