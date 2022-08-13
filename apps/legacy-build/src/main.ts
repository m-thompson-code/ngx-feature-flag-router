import { buildLegacyLib } from 'legacy-utilities';
import { environment } from './environments/environment';

/**
 * Build all angular versions of ngx-feature-flag-router libs
 */
const main = async () => {
    try {
        for (const angularVersion of environment.angularVersions) {
            await buildLegacyLib(angularVersion);
        }
    } catch (error) {
        process.exit(1);
    }
};

main();
