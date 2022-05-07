import { AngularVersion, PackageMajorVersion, PackageVersion } from '../types';

export const getPackageMajorVersion = (angularVersion: AngularVersion): PackageMajorVersion => {
    const majorVersions: Record<AngularVersion, PackageMajorVersion> = {
        [AngularVersion.nine]: PackageMajorVersion.nine,
        [AngularVersion.ten]: PackageMajorVersion.ten,
        [AngularVersion.eleven]: PackageMajorVersion.eleven,
        [AngularVersion.twelve]: PackageMajorVersion.twelve,
        [AngularVersion.source]: PackageMajorVersion.source,
    };

    return majorVersions[angularVersion];
}

export const getPackageVersion = (versionString: string): PackageVersion => {
    const parts = versionString.split('.');

    if (parts.length !== 3) {
        throw new Error('Unexpected number of parts for version');
    }

    const major = +parts[0] ?? NaN;
    const minor = +parts[1] ?? NaN;
    const patch = +parts[2] ?? NaN;

    if (isNaN(major) || !major) {
        throw new Error('Unexpected major version');
    }

    if (isNaN(minor)) {
        throw new Error('Unexpected minor version');
    }

    if (isNaN(patch)) {
        throw new Error('Unexpected patch version');
    }

    return {
        major, minor, patch
    };
};

export const getPackageVersionString = (version: PackageVersion): string => {
    return `${version.major}.${version.minor}.${version.patch}`;
};
