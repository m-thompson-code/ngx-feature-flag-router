import { AngularVersion } from '../types';
import { exec, getDistPath, spawn } from '../utilities';

export const getExistingLegacyLibPackageVersions = async(): Promise<string[]> => {
    const response = exec('npm show ngx-feature-flag-router versions');
    return JSON.parse(response.replace(/'/g, '"'));
};

export const publishLegacyLib = async (angularVersion: AngularVersion): Promise<void> => {
    await spawn('npm', ['publish', getDistPath(angularVersion)]);
};
