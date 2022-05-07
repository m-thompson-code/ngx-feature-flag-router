/* eslint-disable max-len */

import * as fs from 'fs-extra';

import { AngularVersion } from '../types';
import {
    getLegacyLibPackageJsonPath,
    getPackageMajorVersion,
    getPackageVersion,
    getPackageVersionString,
    getProjectPackageJsonPath,
} from '../utilities';

export const updateLegacyPackageJson = (angularVersion: AngularVersion): void => {
    console.log(getProjectPackageJsonPath());

    const sourcePackage = fs.readJsonSync(getProjectPackageJsonPath());

    const { version: sourceVersion, description, license, repository, bugs, homepage, author, keywords } = sourcePackage;

    const packageVersion = getPackageVersion(sourceVersion);

    const legacyVersion = getPackageVersionString({ ...packageVersion, major: getPackageMajorVersion(angularVersion) });

    const legacyLibPackageJsonPath = getLegacyLibPackageJsonPath(angularVersion);

    const _legacyLibPackageJson = fs.readJsonSync(legacyLibPackageJsonPath);
    const legacyLibPackage = {
        ..._legacyLibPackageJson,
        version: legacyVersion,
        description,
        license,
        repository,
        bugs,
        homepage,
        author,
        keywords,
    };

    console.log(legacyLibPackageJsonPath);
    console.log(legacyLibPackage);

    // fs.writeJSONSync(legacyPackageLockJsonPath, legacyPackageLockJson);
}

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
