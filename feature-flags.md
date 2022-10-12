## Feature Flags

Feature flags or feature toggles turns select functionality on and off during runtime, without deploying new code.

### Why use Feature Flags

This enables teams to make changes without pushing additional code and allows for more controlled experimentation over the lifecycle of features.

Allows teams to perform QA and verify that new features behave as expected.

### Feature Flag Use Cases

1. Product Testing - Teams can release a new product feature or a partial idea of the feature in a feature flag and deploy it to a subset of users to gather feedback.

2. A/B Testing - an experiment where two or more variants of a page are shown to users at random, and statistical analysis is used to determine which variation performs better.

3. Backend migrations - A database field may be modified, removed, or added in an application database. Once the team makes the changes to the database, they can switch toggle the feature flag to match the application code.

4. Frontend migrations - Applications might be rebuilt and planned to be replaced. Once the team makes the completes rebuilding a section of the application, they can switch toggle the feature flag to enable the application changes.

5. Canary launches - new feature or code change is deployed to a small subset of users to monitor its behavior before releasing it to the full set of users. If the new feature shows any indication of errors or failure, it is automatically rolled back.

6. System outage - “switch off” the entire website for maintenance or downtime.

7. Continuous deployment - New code can automatically merge and deploy to production and then wait behind a feature flag.

---

## ngx-feature-flag-router

Angular library that supports Angular 9 to 14 that exports `FeatureFlagRouterModule`. Allows you to dynamically load multiple `NgModules` given the same route by providing a Feature Flag.

### What is ngx-feature-flag-router

    -   Basically everything `RouterModule` does but more
    -   Uses a Feature Flag to dynamically load NgModules when using `loadChildren`
    -   Can use `Services` to generate `Routes` -> allows api calls and application state to manage navigation
    -   Supports `booleans`, `Promises`, `Observables`

### How lib solves feature flag problems

    -   Allows navigation to the same url with multiple variants of `NgModules` to load different pages
    -   Allows dynamically providing different Services without changing `Component` logic
    -   Hide/show additional add-ons by wrapping existing `NgModules` conditionally with another NgModule and taking advtantage of providers
    -   Allows for dynamic `Components` as well by taking advantage of `Providers` and `ViewContainerRef`

### General solutions / examples

    -   Admin vs user permissions management
    -   Allows for dynamic components (Ionic iOS / material components)
    -   Easy Login/404/403 redirects while keeping url
    -   Easy maintenance / downtime redirects dynamically

### How it works

    -   Takes advantange that `loadChildren` can use `() => Observable<Module>`
    -   Takes advantange that `loadComponent` can use `() => Observable<Component>`
    -   Splits single `FeatureFlagRoute` into two `Route`s
    -   First route navigates to either `ModuleA` or `ModuleB`
    -   ->  memorizes it for current feature flag through `urlMatcher`
    -   second route navigates to the other (memorizes it too)

### How it’s currently maintained (Nx, jest, cypress)

    -   Nx to manage demo site and library
    -   Build for Angular 9 - 14
    -   Conditional code for Angular 14 for loadComponent logic

### Why not just make it a code snippet (code is a little too bulky and complex for that)

    -   Involves creating a replacement for RouterModule
    -   350 lines of code (including types)
    -   Should be tested since it's an out-of-the-box approach to handling

### What about the alternatives

1. Directives (NgIf or any other structural directives)

    - Common way to handle these types of situations

    * Doesn't allow for lazy-loading, users have to load both modules
    * Complicates templates with extra fluff

2. Guards using canLoad/canActivate and silent redirects
    - Polutes Routes with a lot of extra code
    - silent redirects
    - Browser history can be buggy depending on which Angular version you're using

### How Angular could faze this library out by making a small tweak to their Routes code

    -   Just update loadChildren/loadComponent to call promise/observable function again on visiting url more than once
    -   RedirectCommand - [Add ability to return UrlTree with NavigationBehaviorOptions from guards](https://github.com/angular/angular/pull/45023)
