import { ALL_ANGULAR_VERSIONS, distributeReadmeFiles, writeUpdatedLegacyPackageJson } from 'legacy-utilities';

/**
 * Update package.json for all angular versions of ngx-feature-flag-router libs
 * based on root package.json
 */
export const main = () => {
    try {
        for (const angularVersion of ALL_ANGULAR_VERSIONS) {
            writeUpdatedLegacyPackageJson(angularVersion);
            distributeReadmeFiles(angularVersion);
        }
    } catch (error) {
        process.exit(1);
    }
};

main();
