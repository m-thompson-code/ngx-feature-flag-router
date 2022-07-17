import { AngularVersion, buildLegacyLib, runLegacyE2EScripts } from 'legacy-utilities';
import { environment } from './environments/environment';

/**
 * Run e2e tests for all angular versions of ngx-feature-flag-router libs
 */
const main = async () => {
    try {
        for (const angularVersion of environment.angularVersions) {
            // All non-source versions of the legacy apps use the build of the ngx-feature-flag-router lib
            // To ensure that the build is available, we need to build before running e2e tests
            // 
            // Note that the builds have to be done again after the tests before publishing
            // This is because ngcc runs and lib builds cannot be published if they have IVY enabled
            if (angularVersion !== AngularVersion.source) {
                await buildLegacyLib(angularVersion);
            }
    
            await runLegacyE2EScripts(angularVersion);
        }
    } catch(error) {
        process.exit(1);
    }
};

main();
