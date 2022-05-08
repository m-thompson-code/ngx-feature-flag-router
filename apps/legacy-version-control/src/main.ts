import { ALL_ANGULAR_VERSIONS, writeUpdatedLegacyPackageJson } from 'legacy-utilities';

/**
 * Update package.json for all angular versions of ngx-feature-flag-router libs
 * based on root package.json
 */
export const main = () => {
    for (const angularVersion of ALL_ANGULAR_VERSIONS) {
        try {
            writeUpdatedLegacyPackageJson(angularVersion);
        } catch(error) {
            process.exit(1);
        }
    }
};

main();
