import { AngularVersion, buildLegacyLib, runLegacyE2EScripts } from 'legacy-utilities';
import { environment } from './environments/environment';

const main = async () => {
    for (const angularVersion of environment.angularVersions) {
        await runLegacyE2EScripts(angularVersion);
        // Running tests require serving Angular application
        // By doing this, the lib dependency runs through ngc/ngcc which invalidates it for publishing
        // To correct this, we have to build after performing e2e tests
        if (angularVersion !== AngularVersion.source) {
            // This is only required all non-current versions of Angular
            // This is because Nx manages the whatever current version we have for the project
            await buildLegacyLib(angularVersion);
        }
    }
};

main();
