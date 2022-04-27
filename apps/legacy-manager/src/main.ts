import * as fs from 'fs-extra';
import {
    getProjectPath,
    getDistPath,
    getSrcPath,
    getPermSrcPath,
    getAppPath,
    getMainAppPath,
    getLibSrcPath,
    getMainLibSrcPath,
    getNodeModulesPath,
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
    // console.log(distPath);
    // console.log(srcPath);
    // console.log(permSrcPath);
    // console.log(appPath);
    // console.log(mainAppPath);
    // console.log(libSrcPath);
    // console.log(mainLibSrcPath);

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
    const nodeModulesPath = getNodeModulesPath(__angularVersion);

    return fs.existsSync(nodeModulesPath);
};

const installDependencies = async (__angularVersion) => {
    const projectPath = getProjectPath(__angularVersion);

    const nodeModulesPath = getNodeModulesPath(__angularVersion);

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

        await installDependencies(__angularVersion);
    }

    copyFromMainPaths(__angularVersion);

    await buildLib(__angularVersion);

    console.log('create lib build');

    await test(
        `npm run --prefix ${getProjectPath(__angularVersion)} start`,
        'http://0.0.0.0:4200',
        `nx e2e-angular-${__angularVersion} legacy-e2e`,
    );
};

const main = async () => {
    if (isNaN(angularVersion) || (angularVersion !== 0 && (angularVersion < 8 || angularVersion > 13))) {
        console.log(`Unexpected angular version: ${angularVersion}`);

        process.exit(1);
    }

    const __angularVersions = [9, 10, 11, 12];

    for (const __angularVersion of __angularVersions) {
        try {
            await validateLib(__angularVersion);
        } catch (error) {
            console.error(error);
            return;
        }
    }
};

main();
