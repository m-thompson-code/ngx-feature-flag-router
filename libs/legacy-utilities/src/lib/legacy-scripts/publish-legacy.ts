import { AngularVersion } from '../types';
// import { spawn } from '../utilities';

export const publishLegacyLib = async (angularVersion: AngularVersion): Promise<void> => {
    console.log(`Mock publish ${angularVersion}`);
    // if (angularVersion === AngularVersion.source) {
    //     await spawn('npm', ['publish', 'dist/libs/ngx-feature-flag-router']);
    //     return;
    // }

    // await spawn('npm', ['publish', `apps/legacy/angular-${angularVersion}/dist/ngx-feature-flag-router`]);
};
