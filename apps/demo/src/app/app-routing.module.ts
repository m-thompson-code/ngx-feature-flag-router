import { CommonModule, ViewportScroller } from "@angular/common";
import { NgModule } from "@angular/core";
import { Router, RouterModule, Scroll } from "@angular/router";
import { FeatureFlagRoutes } from "ngx-feature-flag-router";
import { filter } from "rxjs/operators";
// import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: FeatureFlagRoutes = [
    {
        path: "",
        loadChildren: () => import("./root/root.module").then((m) => m.RootModule),
    },
    // {
    //     path: "routes",
    //     loadChildren: () => import("./routes/ab-routes/ab.module").then((m) => m.ABModule),
    // },
    // {
    //     path: "other",
    //     loadChildren: () => import("./routes/cd-routes/cd.module").then((m) => m.CDModule),
    // },
    // {
    //     path: "root/e/:id",
    //     loadChildren: () => import("./routes/ef-routes/e/e.module").then((m) => m.EModule),
    // },
    // {
    //     path: "root/f/:id",
    //     loadChildren: () => import("./routes/ef-routes/f/f.module").then((m) => m.FModule),
    // },
    // {
    //     path: "moar",
    //     loadChildren: () => import("./routes/gh-routes/gh.module").then((m) => m.GHModule),
    // },
    // {
    //     path: "even-moar",
    //     loadChildren: () => import("./routes/ij-routes/ij.module").then((m) => m.IJModule),
    // },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, {
            // preloadingStrategy: PreloadAllModules,
            onSameUrlNavigation: "reload",
            scrollPositionRestoration: "enabled",
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
    constructor(router: Router, viewportScroller: ViewportScroller) {
        router.events.pipe(filter((e: unknown): e is Scroll => e instanceof Scroll)).subscribe((e) => {
            if (e.position) {
                // backward navigation
                viewportScroller.scrollToPosition(e.position);
                // scrollPositionRestoration has issues,
                // To workaround this issue, using setTimeout can allow for repositioning to the right place on navigation back
                // source: https://github.com/angular/angular/issues/24547#issuecomment-1053579143
                setTimeout(() => {
                    e.position && viewportScroller.scrollToPosition(e.position);
                }, 0);
            } else if (e.anchor) {
                // anchor navigation
                viewportScroller.scrollToAnchor(e.anchor);
            } else {
                // forward navigation
                viewportScroller.scrollToPosition([0, 0]);
            }
        });
    }
}
