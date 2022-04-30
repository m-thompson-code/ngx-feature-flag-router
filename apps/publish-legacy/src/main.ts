import { publishLegacyLib } from 'legacy-utilities';
import { environment } from './environments/environment';

const main = async () => {
    for (const angularVersion of environment.angularVersions) {
        await publishLegacyLib(angularVersion);
    }
};

main();
