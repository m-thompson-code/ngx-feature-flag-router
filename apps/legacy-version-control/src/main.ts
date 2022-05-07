import { ALL_ANGULAR_VERSIONS, updateLegacyPackageJson } from 'legacy-utilities';


export const main = () => {
    for (const angularVersion of ALL_ANGULAR_VERSIONS) {
        try {
            updateLegacyPackageJson(angularVersion);
        } catch(error) {
            process.exit(1);
        }
    }
};

main();
