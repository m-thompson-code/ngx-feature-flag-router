import { AngularVersion } from '../types';
import { getProjectPath, spawn } from '../utilities';
import { distributeSourceLegacyFiles } from './distribute-source-legacy-files';
import { ensureLegacyHasDependencies } from './legacy-dependencies';

/**
 * Build ngx-feature-flag-router lib for specific AngularVersion
 * if AngularVesion isn't source (latest version of angular), node_modules are checked.
 *
 * If they don't exist, they will be installed. Then the source legacy app and ngx-feature-flag-router
 * is copied to the specified AngularVerion's directory and builds.
 */
export const buildLegacyLib = async (angularVersion: AngularVersion): Promise<void> => {
    // Go straight to building source ngx-feature-flag-router
    if (angularVersion === AngularVersion.source) {
        await spawn('nx', ['build', 'ngx-feature-flag-router']);
        return;
    }

    // Make sure node_modules exists
    await ensureLegacyHasDependencies(angularVersion);

    // Copy from source legacy app and ngx-feature-flag-router
    distributeSourceLegacyFiles(angularVersion);

    const projectPath = getProjectPath(angularVersion);

    // Run build
    await spawn('npm', ['run', '--prefix', projectPath, 'build-lib']);
};
