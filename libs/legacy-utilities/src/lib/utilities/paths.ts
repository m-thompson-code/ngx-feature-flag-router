import * as path from 'path';
import { AngularVersion } from '../types';

export const getProjectPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'apps/legacy';
    }

    return `apps/legacy/angular-${angularVersion}`;
};

export const getNodeModulesPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'node_modules';
    }

    return path.join(getProjectPath(angularVersion), 'node_modules');
};

export const getDistPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'dist/ngx-feature-flag-router';
    }

    return path.join(getProjectPath(angularVersion), 'dist/ngx-feature-flag-router');
};

export const getSrcPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'apps/legacy/src';
    }

    return path.join(getProjectPath(angularVersion), 'src');
};

export const getPermSrcPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        throw new Error("Unexpected AngularVersion source. Source legacy doesn't have permSrc");
    }

    return path.join(getProjectPath(angularVersion), '__src__');
};

export const getAppPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'apps/legacy/src/app';
    }

    return path.join(getSrcPath(angularVersion), 'app');
}

export const getLibSrcPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'libs/ngx-feature-flag-router/src';
    }

    return path.join(getProjectPath(angularVersion), 'projects/ngx-feature-flag-router/src');
};

// Package version control paths

export const getProjectPackageJsonPath = (): string => {
    return 'package.json';
};

export const getProjectPackageLockJsonPath = (): string => {
    return 'package-lock.json';
};

export const getLegacyPackageJsonPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        throw new Error('Unexpected AngularVersion source. Source legacy package.json');
    }

    return path.join(getProjectPath(angularVersion), 'package.json');
};

export const getLegacyPackageLockJsonPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        throw new Error('Unexpected AngularVersion source. Source legacy package-lock.json');
    }

    return path.join(getProjectPath(angularVersion), 'package-lock.json');
};

export const getLegacyLibPackageJsonPath = (angularVersion: AngularVersion): string => {
    if (angularVersion === AngularVersion.source) {
        return 'libs/ngx-feature-flag-router/package.json';
    }

    return path.join(getProjectPath(angularVersion), '/projects/ngx-feature-flag-router/package.json');
};
