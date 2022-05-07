// source: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation
export {};

declare global {
    interface Window {
        /**
         * Used to detect sync feature flag is on
         */
        __sync_feature_flag_state__?: boolean;
    }
}