import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CComponent } from "./c.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "",
        component: CComponent,
    },
];

@NgModule({
    declarations: [CComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CModule {}
