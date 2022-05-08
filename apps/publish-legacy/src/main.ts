import { getExistingLegacyLibPackageVersions, getLegacyPackageJson, publishLegacyLib } from 'legacy-utilities';
import { environment } from './environments/environment';

const main = async () => {
    const existingVersions = await getExistingLegacyLibPackageVersions();

    for (const angularVersion of environment.angularVersions) {
        try {
            const legacyLibPackageJson = getLegacyPackageJson(angularVersion);
            const currentVersion = legacyLibPackageJson.version;

            if (existingVersions.includes(currentVersion)) {
                console.log('Skipping publish since version is already available on npmjs', currentVersion);
                continue;
            }

            await publishLegacyLib(angularVersion);
        } catch(error) {
            process.exit(1);
        }
    }
};

main();
