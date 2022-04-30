import * as path from 'path';
import { AngularVersion } from '../types';

export const getProjectPath = (angularVersion: AngularVersion) => {
    if (angularVersion === AngularVersion.source) {
        return 'apps/legacy';
    }

    return `apps/legacy/angular-${angularVersion}`;
}

export const getNodeModulesPath = (angularVersion: AngularVersion) => {
    if (angularVersion === AngularVersion.source) {
        return 'node_modules';
    }

    return path.join(getProjectPath(angularVersion), 'node_modules');
}

export const getDistPath = (angularVersion: AngularVersion) => {
    if (angularVersion === AngularVersion.source) {
        return 'dist/ngx-feature-flag-router';
    }

    return path.join(getProjectPath(angularVersion), 'dist/ngx-feature-flag-router');
}

export const getSrcPath = (angularVersion: AngularVersion) => {
    if (angularVersion === AngularVersion.source) {
        return 'apps/legacy/src';
    }

    return path.join(getProjectPath(angularVersion), 'src');
}

export const getPermSrcPath = (angularVersion: AngularVersion) => {
    if (angularVersion === AngularVersion.source) {
        throw "Unexpected AngularVersion source. Source legacy doesn't have permSrc";
    }

    return path.join(getProjectPath(angularVersion), '__src__');
}

export const getAppPath = (angularVersion: AngularVersion) => {
    if (angularVersion === AngularVersion.source) {
        return 'apps/legacy/src/app';
    }

    return path.join(getSrcPath(angularVersion), 'app');
}

export const getLibSrcPath = (angularVersion: AngularVersion) => {
    if (angularVersion === AngularVersion.source) {
        return 'libs/ngx-feature-flag-router/src';
    }

    return path.join(getProjectPath(angularVersion), 'projects/ngx-feature-flag-router/src');
}
