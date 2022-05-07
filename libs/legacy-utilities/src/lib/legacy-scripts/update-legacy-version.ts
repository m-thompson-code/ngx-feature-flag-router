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

    fs.writeJSONSync(legacyLibPackageJsonPath, legacyLibPackage, {
        spaces: 4,
    });
}
