/**
 * Sync Coordinator (Placeholder)
 * 
 * Coordinates data synchronization between local storage and remote API.
 * Handles conflict resolution and manages sync state.
 * 
 * NOTE: This is a placeholder. Full implementation will come later.
 */

export type SyncStatus = 'idle' | 'syncing' | 'error';

export interface SyncState {
    status: SyncStatus;
    lastSyncAt?: string;
    error?: string;
}

export interface ISyncCoordinator {
    getStatus(): SyncState;
    sync(): Promise<void>;
    reset(): Promise<void>;
}

// Placeholder implementation
export const SyncCoordinator: ISyncCoordinator = {
    getStatus() {
        return { status: 'idle' as SyncStatus };
    },
    async sync() {
        // No-op placeholder
    },
    async reset() {
        // No-op placeholder
    },
};
