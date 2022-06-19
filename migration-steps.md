## Migrating to Latest Major Angular Version

### Update to Latest Version of Nx (before supporting Latest Major Version of Angular)

[Nx releases](https://github.com/nrwl/nx/releases?page=1)

Example: Upgrading to Angular 14

Latest Angular 13 support version is [14.1.9](https://github.com/nrwl/nx/releases/tag/14.1.9)

This is because [14.2.1](https://github.com/nrwl/nx/releases/tag/14.2.1)
adds v14 migration script (There is no 14.2.0 release)

1. Migrate to that latest version of Nx that supports the previous Angular version

[Nx migration docs](https://nx.dev/using-nx/updating-nx#step-1-updating-dependencies-and-generating-migrations)

```cmd
nx migrate 14.1.9 # same as nx migrate @nrwl/workspace@14.1.9
```

Follow the steps suggested to complete the migration. Typically this is 2 parts:

```cmd
npm install
```

```cmd
nx migrate --run-migrations
```

2. Delete migrations.json

```cmd
rm migrations.json
```

3. Deploy and publish library

```cmd
npm run deploy:demo
```

```cmd
npm run publish:lib
```

Complete this step to confirm that demo and lib still function as expected

### Add Previous Version to legacy/older-angular-versions
1. Create directory outside of `ngx-feature-flag-router` project

`github/ngx-feature-flag-router`// <-- root of Nx project
`github/angular-major-versions/angular-13/` <-- some other directory not nested in Nx project

Navigate to `github/angular-major-versions/angular-13/`

2. Install `angular/cli@^#` for whatever previous major version of Angular:

While inside the `github/angular-major-versions/angular-13/` directory and NOT `github/ngx-feature-flag-router`

```cmd
npm i -D @angular/cli@^13
```

2. Create new Angular project named `legacy`:

```cmd
ng new legacy --routing=true --style=scss
```

3. Go into `legacy` directory:

```cmd
cd legacy
```

4. Add `ngx-feature-flag-router` project:

```cmd
ng generate library ngx-feature-flag-router
```

5. Copy `legacy` directory into Nx project's `older-angular-versions` directory:

Create new directory for older version of Angular. In this case we want an Angular 13 directory:

`apps/legacy/older-angular-versions/angular-13`

6. Delete unneeded files/directories:

```cmd
rm apps/legacy/older-angular-versions/angular-13/.vscode
rm apps/legacy/older-angular-versions/angular-13/src/app
rm apps/legacy/older-angular-versions/angular-13/src/test.ts
rm apps/legacy/older-angular-versions/angular-13/projects/ngx-feature-flag-router
```

7. Rename `src` directory to `__src__`:

`apps/legacy/older-angular-versions/angular-13/projects/ngx-feature-flag-router/src` --> `apps/legacy/older-angular-versions/angular-13/projects/ngx-feature-flag-router/__src__`

8. Migrate files from `legacy` Nx app to old version of `legacy`:

copy `apps/legacy/src/app` to `apps/legacy/older-angular-versions/angular-13/__src__/app`
copy `apps/legacy/src/window.d.ts` to `apps/legacy/older-angular-versions/angular-13/__src__/window.d.ts`
copy `apps/legacy/older-angular-versions/angular-12/projects/ngx-feature-flag-router` to `apps/legacy/older-angular-versions/angular-12/projects/ngx-feature-flag-router`

9. Update `apps/legacy/older-angular-versions/angular-13/projects/ngx-feature-flag-router/package.json` to refer to the correct major version:

```json
{
    "version": "13.0.2",
    // ...
    "peerDependencies": {
        "@angular/common": "13",
        "@angular/core": "13",
        "@angular/router": "13",
        // ...
    },
    // ...
}

```

10. Update `apps/legacy/older-angular-versions/angular-13/__src__/index.html`:

```html
<!doctype html>
    <!-- .... -->
    <head>
        <!-- .... -->
        <title>Legacy 13</title>
        <!-- .... -->
    <body>
        <legacy-root></legacy-root>
    </body>
</html>
```

11. Update `apps/legacy/older-angular-versions/angular-13/package.json` to have include expected npm scripts:

```json
"scripts": {
    // ...
    "install-dependencies": "npm install",
    // ...
    "build-lib": "ng build ngx-feature-flag-router",
    // ...
  },
```

### Add e2e configuration for latest older version of Angular

1. Create configuration file for latest older major version of Angular:

Copy from `apps/legacy-e2e/cypress.angular-12.json` to create `apps/legacy-e2e/cypress.angular-13.json`

in `apps/legacy-e2e/cypress.angular-13.json`, replace `12` with `13`. There should be 3 locations:

```json
"videosFolder": "../../dist/cypress/apps/legacy-e2e/angular-13/videos",
"screenshotsFolder": "../../dist/cypress/apps/legacy-e2e/angular-13/screenshots",
"env": {
    "ANGULAR_VERSION": 13,
   // ...
}
//...
```

2. Update `apps/legacy-e2e/cypress.json` for the latest major version of Angular

```json
"env": {
    "ANGULAR_VERSION": 14,
    //...
}
//...
```

3. Update `apps/legacy-e2e/project.json` to include latest older major version of Angular:

```json
"e2e-angular-13": {
    "executor": "@nrwl/cypress:cypress",
    "options": {
        "cypressConfig": "apps/legacy-e2e/cypress.angular-13.json",
        "baseUrl": "http://0.0.0.0:4200"
    }
},
```

### Update Nx app `legacy-version-control`

1. Include latest older major version to `apps/legacy-version-control/project.json`:

```json
 "13": {
    "optimization": true,
    "extractLicenses": false,
    "inspect": false,
    "fileReplacements": [
        {
            "replace": "apps/legacy-version-control/src/environments/environment.ts",
            "with": "libs/legacy-utilities/src/environments/environment.13.ts"
        }
    ]
},
```

### Update Nx app `publish-legacy`

1. Include latest older major version to `apps/publish-legacy/project.json`:

```json
 "13": {
    "optimization": true,
    "extractLicenses": false,
    "inspect": false,
    "fileReplacements": [
        {
            "replace": "apps/publish-legacy/src/environments/environment.ts",
            "with": "libs/legacy-utilities/src/environments/environment.13.ts"
        }
    ]
},
```

### Update Nx app `test-legacy`

1. Include latest older major version to `apps/test-legacy/project.json`:

```json
 "13": {
    "optimization": true,
    "extractLicenses": false,
    "inspect": false,
    "fileReplacements": [
        {
            "replace": "apps/test-legacy/src/environments/environment.ts",
            "with": "libs/legacy-utilities/src/environments/environment.13.ts"
        }
    ]
},
```

### Add 

1. Add to Environment enum at `libs/legacy-utilities/src/lib/types/angular-versions.ts`

```typescript
export enum AngularVersion {
    // ...
    thirteen =  13,
    // ...
};
```

2. Include `environment.X.ts` in `libs/legacy-utilities/src/environments`

```typescript
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AngularVersion } from 'legacy-utilities';
import { Environment } from './environment.type';

export const environment: Environment = {
    angularVersions: [AngularVersion.thirteen],
} as const;

```

3. Include latest old major version to `getPackageMajorVersion` at `libs/legacy-utilities/src/lib/utilities/package-version-helper.ts`:

```typescript
export const getPackageMajorVersion = (angularVersion: AngularVersion): PackageMajorVersion => {
    const majorVersions: Record<AngularVersion, PackageMajorVersion> = {
        [AngularVersion.thirteen]: PackageMajorVersion.thirteen,
        // ...
    };
}
```

4. Include latest old major version to `PackageMajorVersion` and update `source` at `libs/legacy-utilities/src/lib/types/package-version.ts`:

```typescript
export enum PackageMajorVersion {
    // ...
    thirteen = 13,
    source =  14,
}
```

5. Add latest old major version to `ALL_ANGULAR_VERSIONS` at `libs/legacy-utilities/src/lib/utilities/angular-versions.ts`

```typescript
export const ALL_ANGULAR_VERSIONS = [
    // ...
    AngularVersion.thirteen,
    // ...
] as const;
```

### Update package.json versions:

1. `package.json`
2. `libs/ngx-feature-flag-router/package.json`

### Update .gitignore:

1. Add temporary directories for latest old major version:

# Legacy temporary application sources
# ...
/apps/legacy/older-angular-versions/angular-13/src

# Legacy temporary libraries
# ...
/apps/legacy/older-angular-versions/angular-13/projects/ngx-feature-flag-router/src
