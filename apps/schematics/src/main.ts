import * as fs from 'fs-extra';
import { ALL_ANGULAR_VERSIONS, getDistSchematicsPath, spawn } from 'legacy-utilities';

/**
 * Build schematics
 */
export const buildSchematics = async (): Promise<void> => {
    await spawn('npm', [
        'run',
        '--prefix',
        'apps/schematics/src/lib-schematics',
        'build',
    ]);
};

/**
 * Copy built schematics into all version of ngx-feature-flag-router
 */
export const copySchematicsToLibBuilds = () => {
    for (const angularVersion of ALL_ANGULAR_VERSIONS) {
        try {
            const src = 'dist/lib-schematics/schematics';
            const dest = getDistSchematicsPath(angularVersion);

            fs.copySync(src, dest, { overwrite: true });
        } catch(error) {
            process.exit(1);
        }
    }
}

/**
 * Build schematics and copy to all ngx-feature-flag-router builds.
 * Should run after all versions of ngx-feature-flag-router build complete.
 */
const main = async () => {
    try {
        await buildSchematics();

        copySchematicsToLibBuilds();
    } catch(error) {
        process.exit(1);
    }
};

main();
