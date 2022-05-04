import { AngularVersion } from '../types';

export const ALL_ANGULAR_VERSIONS = [
    AngularVersion.source,
    AngularVersion.nine,
    AngularVersion.ten,
    AngularVersion.eleven,
    AngularVersion.twelve,
] as const;

export const SOURCE_ANGULAR_VERSION = 13;
