// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ALL_ANGULAR_VERSIONS } from 'legacy-utilities';
import { Environment } from './environment.type';

export const environment: Environment = {
    angularVersions: ALL_ANGULAR_VERSIONS,
} as const;
