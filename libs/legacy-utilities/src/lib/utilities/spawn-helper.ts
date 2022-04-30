import { spawn as __internal_spawn__, SpawnOptions } from 'child_process';

export const spawn = async (command: string, args: readonly string[] = [], options: SpawnOptions = {}) => {
    return new Promise((resolve, reject) => {
        const spawnInstance = __internal_spawn__(command, [...args], { stdio: 'inherit', ...options });
        let code: unknown;
        let error: unknown;

        const setCode = (_code: unknown) => {
            code = _code;
            return handleComplete();
        }

        const setError = (_error: unknown) => {
            error = _error;
            console.error(error);
            return handleComplete();
        }

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
