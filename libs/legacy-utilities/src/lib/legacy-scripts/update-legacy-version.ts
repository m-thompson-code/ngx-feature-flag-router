import * as fs from 'fs-extra';

import { AngularVersion } from '../types';
import {
    getLegacyLibPackageJsonPath,
    getPackageMajorVersion,
    getPackageVersion,
    getPackageVersionString,
    getProjectPackageJsonPath,
} from '../utilities';

export const getLegacyPackageJson = (angularVersion: AngularVersion): Record<string,string> => {
    return fs.readJsonSync(getLegacyLibPackageJsonPath(angularVersion));
};

export const getUpdatedLegacyPackageJson = (angularVersion: AngularVersion): { [x: string]: string } => {
    const sourcePackage = fs.readJsonSync(getProjectPackageJsonPath());

    const { version: sourceVersion, description, license, repository, bugs, homepage, author, keywords } = sourcePackage;

    const packageVersion = getPackageVersion(sourceVersion);

    const legacyVersion = getPackageVersionString({ ...packageVersion, major: getPackageMajorVersion(angularVersion) });

    const legacyLibPackageJson = getLegacyPackageJson(angularVersion);

    return {
        ...legacyLibPackageJson,
        version: legacyVersion,
        description,
        license,
        repository,
        bugs,
        homepage,
        author,
        keywords,
    };
}

export const writeUpdatedLegacyPackageJson = (angularVersion: AngularVersion): void => {
    const legacyLibPackageJsonPath = getLegacyLibPackageJsonPath(angularVersion);

    const legacyLibPackage = getUpdatedLegacyPackageJson(angularVersion);

    fs.writeJSONSync(legacyLibPackageJsonPath, legacyLibPackage, {
        spaces: 4,
    });
};
