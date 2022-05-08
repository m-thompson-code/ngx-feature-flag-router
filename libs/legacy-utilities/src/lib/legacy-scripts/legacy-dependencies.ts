import { getNodeModulesPath, getProjectPath, spawn } from '../utilities';
import * as fs from 'fs-extra';
import { AngularVersion } from '../types';

/**
 * Check if node_modules exists for legacy app for specific AngularVerson
 */
export const legacyHasDependencies = (angularVersion: AngularVersion): boolean => {
    const nodeModulesPath = getNodeModulesPath(angularVersion);

    return fs.existsSync(nodeModulesPath);
};

/**
 * Install dependencies to populate node_modules for legacy app for specific AngularVerson
 */
export const installLegacyDependencies = async (angularVersion: AngularVersion): Promise<void> => {
    const projectPath = getProjectPath(angularVersion);

    const nodeModulesPath = getNodeModulesPath(angularVersion);

    fs.removeSync(nodeModulesPath);

    await spawn('npm', ['run', '--prefix', projectPath, 'install-dependencies']);
};

/**
 * Check if node_modules exists for legacy app for specific AngularVerson
 * and populate node_modules if it doesn't exist.
 */
export const ensureLegacyHasDependencies = async (angularVersion: AngularVersion): Promise<void> => {
    if (legacyHasDependencies(angularVersion)) {
        return;
    }

    await installLegacyDependencies(angularVersion);
};
