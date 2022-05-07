import { publishLegacyLib } from 'legacy-utilities';
import { environment } from './environments/environment';

const main = async () => {
    for (const angularVersion of environment.angularVersions) {
        try {
            await publishLegacyLib(angularVersion);
        } catch(error) {
            process.exit(1);
        }
    }
};

main();
