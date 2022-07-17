import { getExistingLegacyLibPackageVersions, getLegacyPackageJson, publishLegacyLib } from 'legacy-utilities';
import { environment } from './environments/environment';

/**
 * Publish all angular versions of ngx-feature-flag-router libs
 * Skips any angular version that has already been published
 */
const main = async () => {
    try {
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
            await publishLegacyLib(angularVersion);
        }
    } catch(error) {
        process.exit(1);
    }
};

main();
