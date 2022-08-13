import { getExistingLegacyLibPackageVersions, getLegacyPackageJson, publishLegacyLib } from 'legacy-utilities';
import { argv } from 'process';
import { environment } from './environments/environment';

const getDryRunState = (arg: string): boolean => {
    if (arg === 'dry-run=false') {
        return false;
    }

    if (!arg || arg === 'dry-run' || arg === 'dry-run=true') {
        return true;
    }

    throw new Error('Unexpected argument for required dry-run argument: --args="dry-run=true" or --args="dry-run=false"');
};

/**
 * Publish all angular versions of ngx-feature-flag-router libs
 * Skips any angular version that has already been published
 */
const main = async () => {
    try {
        // Dry run will make it to npm publish, but publish won't actually create a release to npmjs
        const dryRun = getDryRunState(argv[2]);

        // Get all existing published versions
        const existingVersions = await getExistingLegacyLibPackageVersions();

        for (const angularVersion of environment.angularVersions) {
            const legacyLibPackageJson = getLegacyPackageJson(angularVersion);
            const currentVersion = legacyLibPackageJson.version;

            // Check if published version exists
            if (existingVersions.includes(currentVersion)) {
                console.log('Skipping publish since version is already available on npmjs', currentVersion);
                continue;
            }

            // If it doesn't exist, publish it
            await publishLegacyLib(angularVersion, dryRun);
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

main();
