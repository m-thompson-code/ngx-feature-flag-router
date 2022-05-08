import * as fs from 'fs-extra';

/**
 * Clears dest directory and copies src directory to dest directory
 */
export const clearAndCopySync = (src: string, dest: string, options: fs.CopyOptionsSync = {}) => {
    fs.removeSync(dest);
    fs.copySync(src, dest, { ...options, overwrite: true });
}
