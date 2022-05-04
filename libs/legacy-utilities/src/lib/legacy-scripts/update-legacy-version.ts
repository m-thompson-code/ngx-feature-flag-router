/* eslint-disable max-len */

import * as fs from 'fs-extra';

import { AngularVersion } from '../types';
import {
    ALL_ANGULAR_VERSIONS,
    // PACKAGE_JSON_DIRECTORIES,
    // PACKAGE_LOCK_JSON_DIRECTORIES,
    // PACKAGE_LIB_JSON_DIRECTORIES,
    getLegacyLibPackageJsonPath,
    getLegacyPackageJsonPath,
    getLegacyPackageLockJsonPath,
    // getPackageVersion,
    // getPackageVersionString,
    getProjectPackageJsonPath,
    getProjectPackageLockJsonPath,
} from '../utilities';

export const test = () => {
    // console.log('package.json');
    // const file = editJsonFile('package.json');
    // const packageJson = file.get();
    // console.log(packageJson);
    // console.log(packageJson.version);
    // console.log(getPackageVersion(packageJson.version));
    // console.log(getPackageVersionString(getPackageVersion(packageJson.version)));

    console.log(getProjectPackageJsonPath());

    // const source = fs.readJsonSync(getProjectPackageJsonPath());

    // const { version,
    //     license,
    //     repository,
    //     bugs,
    //     homepage,
    //     author,
    //     keywords } = source;

    console.log(getProjectPackageLockJsonPath());
    console.log(fs.readJsonSync(getProjectPackageLockJsonPath()).version);

    for (const angularVersion of ALL_ANGULAR_VERSIONS) {
        if (angularVersion !== AngularVersion.source) {
            console.log(getLegacyPackageJsonPath(angularVersion));
            console.log(fs.readJsonSync(getLegacyPackageJsonPath(angularVersion)).version);
            console.log(getLegacyPackageLockJsonPath(angularVersion));
            console.log(fs.readJsonSync(getLegacyPackageLockJsonPath(angularVersion)).version);
        }

        console.log(getLegacyLibPackageJsonPath(angularVersion));
        console.log(fs.readJsonSync(getLegacyLibPackageJsonPath(angularVersion)).version);
    }
};

// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/package-lock.json

// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/apps/legacy/angular-9/package-lock.json
// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/apps/legacy/angular-9/package.json
// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/apps/legacy/angular-9/projects/ngx-feature-flag-router/package.json

// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/apps/legacy/angular-10/package-lock.json
// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/apps/legacy/angular-10/package.json

// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/apps/legacy/angular-10/projects/ngx-feature-flag-router/package.json

// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/apps/legacy/angular-11/package-lock.json
// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/apps/legacy/angular-11/package.json
// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/apps/legacy/angular-11/projects/ngx-feature-flag-router/package.json

// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/apps/legacy/angular-12/package-lock.json
// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/apps/legacy/angular-12/package.json
// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/apps/legacy/angular-12/projects/ngx-feature-flag-router/package.json

// /Users/markthompson/Documents/github/personal/ngx-feature-flag-router/libs/ngx-feature-flag-router/package.json
