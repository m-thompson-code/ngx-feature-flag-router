import { AngularVersion } from '../types';
import { getProjectPath, spawn } from '../utilities';
import { distributeSourceLegacyFiles } from './distribute-source-legacy-files';
import { ensureLegacyHasDependencies } from './legacy-dependencies';

export const buildLegacyLib = async (angularVersion: AngularVersion): Promise<void> => {
    if (angularVersion === AngularVersion.source) {
        await spawn('nx', ['build', 'ngx-feature-flag-router']);
        return;
    }

    await ensureLegacyHasDependencies(angularVersion);
    
    distributeSourceLegacyFiles(angularVersion);

    const projectPath = getProjectPath(angularVersion);

    await spawn('npm', ['run', '--prefix', projectPath, 'build-lib']);
};
