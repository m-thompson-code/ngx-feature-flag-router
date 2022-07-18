import * as fs from 'fs-extra';
import { AngularVersion } from '../types';
import { getProjectReadmePath, getLegacyReadmePath } from '../utilities/paths';

/**
 * Copies README.md from root project to legacy library
 */
export const distributeReadmeFiles = (angularVersion: AngularVersion): void => {
    const distPath = getProjectReadmePath();
    const readmePath = getLegacyReadmePath(angularVersion);

    fs.copyFileSync(distPath, readmePath);
};
