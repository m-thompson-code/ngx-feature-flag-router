import { spawn as __internal_spawn__, SpawnOptions } from 'child_process';

export const spawn = async (command: string, args: readonly string[] = [], options: SpawnOptions = {}) => {
    return new Promise((resolve, reject) => {
        const moo = __internal_spawn__(command, [...args], { stdio: 'inherit', ...options });

        moo.on('exit', (code) => {
            resolve(code);
        });

        moo.on('error', (error) => {
            console.error(error);
            reject(error);
        });
    });
};
