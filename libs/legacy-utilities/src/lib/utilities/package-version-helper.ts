import { AngularVersion, PackageMajorVersion, PackageVersion } from '../types';

/**
 * Returns package.json version based on AngularVersion. All AngularVersions are the same as their PackageMajorVersion.
 * 
 * The only exception is source. This will map to the latest angular version for PackageMajorVersion
 */
export const getPackageMajorVersion = (angularVersion: AngularVersion): PackageMajorVersion => {
    const majorVersions: Record<AngularVersion, PackageMajorVersion> = {
        [AngularVersion.nine]: PackageMajorVersion.nine,
        [AngularVersion.ten]: PackageMajorVersion.ten,
        [AngularVersion.eleven]: PackageMajorVersion.eleven,
        [AngularVersion.twelve]: PackageMajorVersion.twelve,
        [AngularVersion.thirteen]: PackageMajorVersion.thirteen,
        [AngularVersion.source]: PackageMajorVersion.source,
    };

    return majorVersions[angularVersion];
}

/**
 * Parses package version string to PackageVersion instance where major, minor, patch versions are properties
 */
export const getPackageVersion = (packageVersionString: string): PackageVersion => {
    const parts = packageVersionString.split('.');

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

/**
 * Parses PackageVersion values to a string: `${major}.${minor}.${patch}`
 */
export const getPackageVersionString = (version: PackageVersion): string => {
    return `${version.major}.${version.minor}.${version.patch}`;
};
