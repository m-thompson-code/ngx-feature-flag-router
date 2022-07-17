import * as path from 'path';
import { AngularVersion } from '../types';

/**
 * Path to root of legacy app for specific AngularVersion
 */
export const getProjectPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'apps/legacy';
    }

    return `apps/legacy/older-angular-versions/angular-${angularVersion}`;
};

/**
 * Path to node_modules of legacy app for specific AngularVersion
 */
export const getNodeModulesPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'node_modules';
    }

    return path.join(getProjectPath(angularVersion), 'node_modules');
};

/**
 * Path to dist of legacy app for specific AngularVersion
 */
export const getDistPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'dist/libs/ngx-feature-flag-router';
    }

    return path.join(getProjectPath(angularVersion), 'dist/ngx-feature-flag-router');
};

/**
 * Path to schematics directory of dist of legacy app for specific AngularVersion
 */
export const getDistSchematicsPath = (angularVersion: AngularVersion): string => {
    return path.join(getDistPath(angularVersion), 'schematics');
};

/**
 * Path to src of legacy app for specific AngularVersion.
 * For older versions of Angular (anything but source), this src directory is involved with serve, build, test directly.
 * It is also temporary and is rebuilt using the legacy app's __src__ directory
 */
export const getSrcPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'apps/legacy/src';
    }

    return path.join(getProjectPath(angularVersion), 'src');
};

/**
 * Path to __src__ of legacy app for specific AngularVersion.
 * This is the perminate src directory and is used to repopulate src directory when syncing legacy apps of each version
 */
export const getPermSrcPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        throw new Error("Unexpected AngularVersion source. Source legacy doesn't have permSrc");
    }

    return path.join(getProjectPath(angularVersion), '__src__');
};

/**
 * Path to src/app of legacy app for specific AngularVersion
 */
export const getAppPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'apps/legacy/src/app';
    }

    return path.join(getSrcPath(angularVersion), 'app');
};

/**
 * Path to ngx-feature-flag-router src for specific AngularVersion
 */
export const getLibSrcPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'libs/ngx-feature-flag-router/src';
    }

    return path.join(getProjectPath(angularVersion), 'projects/ngx-feature-flag-router/src');
};

// Package version control paths

/**
 * Path to root package.json
 */
export const getProjectPackageJsonPath = (): string => {
    return 'package.json';
};

/**
 * Path to ngx-feature-flag-router lib package.jsonor specific AngularVersion
 */
export const getLegacyLibPackageJsonPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'libs/ngx-feature-flag-router/package.json';
    }

    return path.join(getProjectPath(angularVersion), '/projects/ngx-feature-flag-router/package.json');
};
