import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GComponent } from "./g.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "",
        component: GComponent,
    },
];

@NgModule({
    declarations: [GComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class GModule {}
