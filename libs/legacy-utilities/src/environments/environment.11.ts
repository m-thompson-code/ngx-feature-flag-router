// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AngularVersion } from 'legacy-utilities';
import { Environment } from './environment.type';

export const environment: Environment = {
    angularVersions: [AngularVersion.eleven],
} as const;
