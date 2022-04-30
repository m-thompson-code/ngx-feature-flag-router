import { getNodeModulesPath, getProjectPath, spawn } from '../utilities';
import * as fs from 'fs-extra';
import { AngularVersion } from '../types';

export const legacyHasDependencies = (angularVersion: AngularVersion): boolean => {
    const nodeModulesPath = getNodeModulesPath(angularVersion);

    return fs.existsSync(nodeModulesPath);
};

export const installLegacyDependencies = async (angularVersion: AngularVersion): Promise<void> => {
    const projectPath = getProjectPath(angularVersion);

    const nodeModulesPath = getNodeModulesPath(angularVersion);

    fs.removeSync(nodeModulesPath);

    await spawn('npm', ['run', '--prefix', projectPath, 'install-dependencies']);
};

export const ensureLegacyHasDependencies = async (angularVersion: AngularVersion): Promise<void> => {
    if (legacyHasDependencies(angularVersion)) {
        return;
    }

    await installLegacyDependencies(angularVersion);
}
