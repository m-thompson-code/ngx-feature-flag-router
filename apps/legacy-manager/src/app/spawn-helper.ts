import { spawn as __internal_spawn__, SpawnOptions } from 'child_process';

export const spawn = async (command: string, args: readonly string[] = [], options: SpawnOptions = {}) => {
    return new Promise((resolve, reject) => {
        const moo = __internal_spawn__(command, [...args], { stdio: 'inherit', ...options });
        let code: any;
        let error: any;

        const setCode = (_code) => {
            code = _code;
            return handleComplete();
        }

        const setError = (_error) => {
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

        moo.on('exit', (code) => {
            setCode(code);
        });

        moo.on('error', (error) => {
            setError(error);
        });

        moo.on('close', (code) => {
            setCode(code);
        });

        moo.on('disconnect', (code) => {
            setCode(code);
        });
    });
};
