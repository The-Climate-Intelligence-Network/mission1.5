/**
 * Background Service (Placeholder)
 * 
 * Wrapper for background task handling.
 * 
 * NOTE: This is a placeholder. Implementation pending.
 */

export type BackgroundTaskHandler = () => Promise<void>;

export interface IBackgroundService {
    registerTask(taskName: string, handler: BackgroundTaskHandler): Promise<void>;
    unregisterTask(taskName: string): Promise<void>;
    isRegistered(taskName: string): Promise<boolean>;
}

// Placeholder implementation
export const BackgroundService: IBackgroundService = {
    async registerTask(_taskName: string, _handler: BackgroundTaskHandler) {
        // No-op
    },
    async unregisterTask(_taskName: string) {
        // No-op
    },
    async isRegistered(_taskName: string) {
        return false;
    },
};
