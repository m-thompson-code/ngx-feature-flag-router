import * as fs from 'fs-extra';
import { AngularVersion } from '../types';
import { clearAndCopySync } from '../utilities';
import {
    getDistPath,
    getSrcPath,
    getPermSrcPath,
    getAppPath,
    getLibSrcPath,
} from '../utilities/paths';

/**
 * Cleans AngularVersion legacy app and ngx-feature-flag-router lib directories
 * then copies from source legacy app and ngx-feature-flag-router lib directories 
 * to AngularVersion legacy app and ngx-feature-flag-router lib directories.
 */
export const distributeSourceLegacyFiles = (angularVersion: AngularVersion): void => {
    if (angularVersion === AngularVersion.source) {
        throw new Error('Unexpected AngularVersion is source. Cannot copy from source to source');
    }
    
    const distPath = getDistPath(angularVersion);
    const srcPath = getSrcPath(angularVersion);
    const permSrcPath = getPermSrcPath(angularVersion);
    const appPath = getAppPath(angularVersion);
    const sourceAppPath = getAppPath(AngularVersion.source);
    const libSrcPath = getLibSrcPath(angularVersion);
    const sourceLibSrcPath = getLibSrcPath(AngularVersion.source);

    fs.removeSync(distPath);
    fs.removeSync(srcPath);
    
    clearAndCopySync(permSrcPath, srcPath);
    clearAndCopySync(sourceAppPath, appPath);
    clearAndCopySync(sourceLibSrcPath, libSrcPath);
};
