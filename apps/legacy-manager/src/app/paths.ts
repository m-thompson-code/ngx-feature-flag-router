import * as path from 'path';

export const getProjectPath = (__angularVersion) => {
    return `apps/legacy/angular-${__angularVersion}`;
}

export const getNodeModulesPath = (__angularVersion) => {
    return path.join(getProjectPath(__angularVersion), 'node_modules');
}

export const getDistPath = (__angularVersion) => {
    return path.join(getProjectPath(__angularVersion), 'dist/ngx-feature-flag-router');
}

export const getSrcPath = (__angularVersion) => {
    return path.join(getProjectPath(__angularVersion), 'src');
}

export const getPermSrcPath = (__angularVersion) => {
    return path.join(getProjectPath(__angularVersion), '__src__');
}

export const getAppPath = (__angularVersion) => {
    return path.join(getSrcPath(__angularVersion), 'app');
}

export const getMainAppPath = () => {
    return 'apps/legacy/src/app';
}

export const getLibSrcPath = (__angularVersion) => {
    return path.join(getProjectPath(__angularVersion), 'projects/ngx-feature-flag-router/src');
}

export const getMainLibSrcPath = () => {
    return 'libs/ngx-feature-flag-router/src';
}