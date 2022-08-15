import * as fs from 'fs-extra';
import { glob } from 'glob';
import { join } from 'path';

/**
 * Clears dest directory and copies src directory to dest directory
 */
export const clearAndCopySync = (src: string, dest: string, options: fs.CopyOptionsSync = {}) => {
    fs.removeSync(dest);
    fs.copySync(src, dest, { ...options, overwrite: true });
};

/**
 * Returns all files and nested files of directory for files given a regex
 */
export const getAllFiles = (directory: string, regex: string): Promise<string[]> => {
    const options = { cwd: directory };

    return new Promise((resolve, reject) => {
        glob(regex, options, (err, relativePaths) => {
            // err is an error object or null.
            if (err) {
                return reject(err);
            }

            // relativePaths is an array of filenames.
            return resolve(relativePaths.map((relativePath) => join(directory, relativePath)));
        });
    });
};

export const removeAngular14Code = async (directory: string): Promise<void> => {
    const paths = await getAllFiles(directory, '**/*.ts');

    paths.forEach((path) => {
        const context = fs.readFileSync(path, 'utf8');

        fs.writeFileSync(path, context.replace(/\s*\/\/\s*START_A14_CODE[\n\s\S]*?\/\/\s*END_A14_CODE/g, ''));
    });
};
