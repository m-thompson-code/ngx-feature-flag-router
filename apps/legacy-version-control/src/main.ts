import { ALL_ANGULAR_VERSIONS, writeUpdatedLegacyPackageJson } from 'legacy-utilities';

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
