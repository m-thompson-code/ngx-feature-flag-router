import { AngularVersion } from '../types';
import { getProjectPath } from '../utilities';
import { spawn } from '../utilities/spawn-helper';

const HOST_URL = 'http://0.0.0.0:4200';

export const runServerAndE2ETests = async (serve: string, url: string, e2e: string): Promise<void> => {
    await spawn('npx', ['start-server-and-test', serve, url, e2e]);
};

export const runLegacyE2EScripts = async (angularVersion: AngularVersion) => {
    if (angularVersion === AngularVersion.source) {
        return spawn('nx', ['e2e', 'legacy-e2e']);
        // return runServerAndE2ETests(
        //     'nx serve legacy',
        //     HOST_URL,
        //     'nx e2e legacy-e2e',
        // );
    }

    return runServerAndE2ETests(
        `npm run --prefix ${getProjectPath(angularVersion)} start`,
        HOST_URL,
        `nx e2e-angular-${angularVersion} legacy-e2e`,
    );
};
