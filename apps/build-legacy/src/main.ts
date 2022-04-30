import { buildLegacyLib } from 'legacy-utilities';
import { environment } from './environments/environment';

const main = async () => {
    for (const angularVersion of environment.angularVersions) {
        await buildLegacyLib(angularVersion);
    }
};

main();
