import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EFeatureComponent } from "./e-feature.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "",
        component: EFeatureComponent,
    },
];

@NgModule({
    declarations: [EFeatureComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class EFeatureModule {}
