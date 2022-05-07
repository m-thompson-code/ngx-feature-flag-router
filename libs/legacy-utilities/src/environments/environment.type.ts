// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AngularVersion } from 'legacy-utilities';

export type Environment = Readonly<{
    readonly angularVersions: Readonly<AngularVersion[]>,
}>
