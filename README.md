# NgxFeatureFlagRouter

![GitHub package.json version](https://img.shields.io/github/package-json/v/m-thompson-code/ngx-feature-flag-router)
![GitHub](https://img.shields.io/github/license/m-thompson-code/ngx-feature-flag-router)
![npm](https://img.shields.io/npm/dt/ngx-feature-flag-router)
![npm](https://img.shields.io/npm/dw/ngx-feature-flag-router)
![Website](https://img.shields.io/website?down_color=red&down_message=offline&label=demo&up_color=green&up_message=online&url=https%3A%2F%2Fm-thompson-code.github.io%2Fngx-feature-flag-router%2F)
![Custom badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fm-thompson-code%2Fngx-feature-flag-router%2Fmain%2Fjest-badge%2Fcoverage.json)

[Demo](https://m-thompson-code.github.io/ngx-feature-flag-router/)

Extends RouteModule functionality to allow for conditionally lazy-loading child routes based on feature flag. Allows for Services to configure Routes and includes helpers for preload strategy.

This allows you to use an endpoint to lazy-load modules, easily redirect users to 403/404 pages, performant A/B testing for features.

## Angular Major Version Support

| Angular Version | Support                                         |
| --------------- | ----------------------------------------------- |
| 9               | ✅ Yes                                          |
| 10              | ✅ Yes                                          |
| 11              | ✅ Yes                                          |
| 12              | ✅ Yes                                          |
| 13              | ✅ Yes                                          |
| 14              | Mostly. Support for `loadComponent` [coming soon](https://github.com/m-thompson-code/ngx-feature-flag-router/tree/standalone-components) |

## Installation

Add:

```bash
ng add ngx-feature-flag-router
```

Update:

```bash
ng update ngx-feature-flag-router #Updates ngx-feature-flag-router to latest version
```

If you're not using the latest version of Angular, you'll have to specify the major version:

```bash
ng update ngx-feature-flag-router@10 #Specific to Angular 10
```

## How to Use

1. Replace `RouterModule.forChild()` with `FeatureFlagRouterModule.forChild()`

Before:

```typescript
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    /*...*/
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class MyModule {}
```

After:

```typescript
import { FeatureFlagRouterModule, FeatureFlagRoutes } from 'ngx-feature-flag-router';

const routes: FeatureFlagRoutes = [
    /*...*/
];

@NgModule({
    imports: [FeatureFlagRouterModule.forChild(routes)],
})
export class MyModule {}
```

2. Add `alternativeLoadChildren` and `featureFlag` to conditional lazy-load alternative module when `featureFlag` returns `true`

Before:

```typescript
const routes: Routes = [
    {
        path: 'hello-world',
        loadChildren: () => import('./hello-world.module').then((m) => m.HelloWorldModule),
    },
];
```

After:

```typescript
const routes: FeatureFlagRoutes = [
    {
        path: 'hello-world',
        loadChildren: () => import('./hello-world.module').then((m) => m.HelloWorldModule),
        alternativeLoadChildren: () => import('./feature.module').then((m) => m.FeatureModule),
        featureFlag: () => showFeature(), // Function that returns boolean
    },
];
```

## How to Use Services / API

1. Add your Service ( `MyService` ) as the second argument of `FeatureFlagRouterModule.forChild()`

```typescript
import { FeatureFlagRouterModule, FeatureFlagRoutes } from 'ngx-feature-flag-router';

// Initialize routes that don't require Service
const routes: FeatureFlagRoutes = [
    /*...*/
];

@NgModule({
    imports: [FeatureFlagRouterModule.forChild(routes, MyService)],
})
export class MyModule {}
```

2. Add implements `FeatureFlagRoutesService` to your Service.

```typescript
@Injectable({ providedIn: 'root' })
export class FeatureFlagService implements FeatureFlagRoutesService {
    // ...
}
```

3. Add `getFeatureRoutes()` method and return your `FeatureFlagRoutes`

```typescript
@Injectable({ providedIn: 'root' })
export class FeatureFlagService implements FeatureFlagRoutesService {
    // Get current user id
    private readonly userId$: Observable<number> = this.getUserId();

    constructor(private readonly httpClient: HttpClient) {}

    /** Set additional routes using Service */
    getFeatureRoutes(): FeatureFlagRoutes {
        return [
            {
                path: 'api-example',
                loadChildren: () => import('api-feature-flag-off.module').then((m) => m.ApiFeatureFlagOffModule),
                alternativeLoadChildren: () => import('api-feature-flag-on.module').then((m) => m.ApiFeatureFlagOnModule),
                featureFlag: () => this.showFeature(), // Function that returns Observable<boolean>
            },
        ];
    }

    /** Determine showing feature based on user id and API response */
    showFeature(): Observable<boolean> {
        // Use current user id
        return this.userId$.pipe(
            switchMap((userId) => {
                // Make specific request for that user
                return this.httpClient.get<UserStatus>('some/api');
            }),
            map((userStatus) => {
                // Check if we want to turn feature flag on or not
                return userStatus.authorized;
            }),
            // Replay results until user id changes if you only want to make the api request once
            shareReplay({ bufferSize: 1, refCount: true }),
        );
    }
}
```

## Mono Repo

Demo and library is managed using [Nx](https://nx.dev).

## Contributing

Before adding any new feature or a fix, make sure to open an issue first :)

1. Make sure to use the expected node/npm versions

```bash
node -v # v14.17.1
```

```bash
npm -v # 6.14.13
```

If you have the wrong versions, I suggest using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) or [volta](https://docs.volta.sh/guide/getting-started) for node version management.

2. Clone the project and install dependencies

```
git clone https://github.com/m-thompson-code/ngx-feature-flag-router.git
npm install
```

3. Create a new branch

```bash
git checkout -b feature/some-feature
```

4. Add tests and make sure demo and library jest / cypress tests pass

```bash
npm run test # both demo and ngx-feature-flag-router lib
```

or

```bash
npm run test:demo # only demo
npm run test:lib # only ngx-feature-flag-router lib
```

You can also run jest tests separately

```bash
npm run jest:demo # only demo jest tests
npm run jest:lib # only ngx-feature-flag-router lib jest tests
```

and cypress tests separately

```bash
npm run e2e:demo # only demo cypress tests
npm run e2e:lib # only ngx-feature-flag-router lib cypress tests
```

5. commit > push > create a pull request 🚀
