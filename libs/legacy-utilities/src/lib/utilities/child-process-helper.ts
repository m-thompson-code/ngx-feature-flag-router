import { spawn as __node_spawn__, execSync as __exec_sync__, SpawnOptions } from 'child_process';

/**
 * Promise wrapper for child_process.spawn
 */
export const spawn = async (command: string, args: readonly string[] = [], options: SpawnOptions = {}): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        const spawnInstance = __node_spawn__(command, [...args], { stdio: 'inherit', ...options });

        let code: unknown;
        let error: unknown;

        const setCode = (_code: unknown) => {
            code = _code;
            return handleComplete();
        };

        const setError = (_error: unknown) => {
            error = _error;
            return handleComplete();
        };

        const handleComplete = () => {
            if (error) {
                return reject(error);
            }

            if (code === 1) {
                return reject('Unexpected spawn failed. Exit code 1');
            }

            return resolve(code);
        };

        spawnInstance.on('exit', (exitCode) => {
            setCode(exitCode);
        });

        spawnInstance.on('error', (spawnError) => {
            setError(spawnError);
        });

        spawnInstance.on('close', (closeCode) => {
            setCode(closeCode);
        });
    });
};

/**
 * Wrapper for child_process.execSync that defaults to returning string of output
 */
export const exec = (command: string): string => {
    return __exec_sync__(command, { encoding: 'utf8' });
};
