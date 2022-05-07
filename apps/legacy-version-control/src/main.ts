import { ALL_ANGULAR_VERSIONS, updateLegacyPackageJson } from 'legacy-utilities';


export const main = () => {
    for (const angularVersion of ALL_ANGULAR_VERSIONS) {
        updateLegacyPackageJson(angularVersion);
    }
};

main();
