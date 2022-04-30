import * as fs from 'fs-extra';
import { AngularVersion } from '../types';
import {
    getProjectPath,
    getDistPath,
    getSrcPath,
    getPermSrcPath,
    getAppPath,
    getLibSrcPath,
} from '../utilities/paths';

export const distributeSourceLegacyFiles = (angularVersion: AngularVersion): void => {
    const projectPath = getProjectPath(angularVersion);
    const distPath = getDistPath(angularVersion);
    const srcPath = getSrcPath(angularVersion);
    const permSrcPath = getPermSrcPath(angularVersion);
    const appPath = getAppPath(angularVersion);
    const sourceAppPath = getAppPath(AngularVersion.source);
    const libSrcPath = getLibSrcPath(angularVersion);
    const sourceLibSrcPath = getLibSrcPath(AngularVersion.source);

    console.log(projectPath);
    // console.log(distPath);
    // console.log(srcPath);
    // console.log(permSrcPath);
    // console.log(appPath);
    // console.log(sourceAppPath);
    // console.log(libSrcPath);
    // console.log(sourceLibSrcPath);

    fs.removeSync(distPath);
    fs.removeSync(srcPath);
    fs.copySync(permSrcPath, srcPath, { overwrite: true });
    fs.removeSync(appPath);
    fs.copySync(sourceAppPath, appPath, { overwrite: true });
    fs.removeSync(libSrcPath);
    fs.copySync(sourceLibSrcPath, libSrcPath, { overwrite: true });

    console.log('distributeSourceLegacyFiles', angularVersion);
};
