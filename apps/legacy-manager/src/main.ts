import * as fs from 'fs-extra';
import * as path from 'path';
import {
    getProjectPath,
    getDistPath,
    getSrcPath,
    getPermSrcPath,
    getAppPath,
    getMainAppPath,
    getLibSrcPath,
    getMainLibSrcPath,
} from './app/paths';
import { spawn } from './app/spawn-helper';

const angularVersion = +process.argv[2] || 0;

const copyFromMainPaths = (__angularVersion) => {
    const projectPath = getProjectPath(__angularVersion);
    const distPath = getDistPath(__angularVersion);
    const srcPath = getSrcPath(__angularVersion);
    const permSrcPath = getPermSrcPath(__angularVersion);
    const appPath = getAppPath(__angularVersion);
    const mainAppPath = getMainAppPath();
    const libSrcPath = getLibSrcPath(__angularVersion);
    const mainLibSrcPath = getMainLibSrcPath();

    console.log(projectPath);
    console.log(distPath);
    console.log(srcPath);
    console.log(permSrcPath);
    console.log(appPath);
    console.log(mainAppPath);
    console.log(libSrcPath);
    console.log(mainLibSrcPath);

    fs.removeSync(distPath);
    fs.removeSync(srcPath);
    fs.copySync(permSrcPath, srcPath, { overwrite: true });
    fs.removeSync(appPath);
    fs.copySync(mainAppPath, appPath, { overwrite: true });
    fs.removeSync(libSrcPath);
    fs.copySync(mainLibSrcPath, libSrcPath, { overwrite: true });

    console.log('copied');
};

const test = async (...args) => {
    return spawn('npx', ['start-server-and-test', ...args]);
};

const hasDependencies = (__angularVersion) => {
    const projectPath = getProjectPath(__angularVersion);

    const nodeModulesPath = path.join(projectPath, 'node_modules');

    return fs.existsSync(nodeModulesPath);
};

const installDependencies = async (__angularVersion) => {
    const projectPath = getProjectPath(__angularVersion);

    const nodeModulesPath = path.join(projectPath, 'node_modules');

    fs.removeSync(nodeModulesPath);

    return spawn('npm', ['run', '--prefix', projectPath, 'install-dependencies']);
};

const buildLib = async (__angularVersion) => {
    const projectPath = getProjectPath(__angularVersion);

    return spawn('npm', ['run', '--prefix', projectPath, 'build-lib']);
};

const validateLib = async (__angularVersion) => {
    console.log(hasDependencies(__angularVersion));

    if (!hasDependencies(__angularVersion)) {
        console.log('installing dependencies');

        try {
            await installDependencies(__angularVersion);
        } catch (error) {
            console.error(error);
            return;
        }
    }

    copyFromMainPaths(__angularVersion);

    try {
        await buildLib(__angularVersion);
    } catch (error) {
        console.error(error);
        return;
    }

    console.log('create lib build');

    try {
        await test('npm run --prefix apps/legacy/angular-9 start', 'http://0.0.0.0:4200', 'nx e2e-angular-9 legacy-e2e');
    } catch (error) {
        console.error(error);
        return;
    }
};

const main = async () => {
    if (isNaN(angularVersion) || (angularVersion !== 0 && (angularVersion < 8 || angularVersion > 13))) {
        console.log(`Unexpected angular version: ${angularVersion}`);

        process.exit(1);
    }

    const __angularVersion = 9;

    try {
        await validateLib(__angularVersion);
    } catch (error) {
        console.error(error);
        return;
    }
};

main();
