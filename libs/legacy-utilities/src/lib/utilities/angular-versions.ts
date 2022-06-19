import { AngularVersion } from '../types';

/**
 * All supported Angular versions, source must be last since publishing order matters.
 * The last version published needs to be the source (latest) version of Angular
 */
export const ALL_ANGULAR_VERSIONS = [
    AngularVersion.nine,
    AngularVersion.ten,
    AngularVersion.eleven,
    AngularVersion.twelve,
    AngularVersion.thirteen,
    AngularVersion.source,
] as const;
