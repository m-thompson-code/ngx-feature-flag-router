/**
 * npm package version
 */
export interface PackageVersion {
    major: number;
    minor: number;
    patch: number;
}

/**
 * Possible major versions of npm package for supported Angular versions
 */
export enum PackageMajorVersion {
    nine =  9,
    ten =  10,
    eleven =  11,
    twelve =  12,
    thirteen = 13,
    source =  14,
}
