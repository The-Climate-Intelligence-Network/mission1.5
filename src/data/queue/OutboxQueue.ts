/**
 * Outbox Queue (Placeholder)
 * 
 * Offline-first outbox pattern for reliable message delivery.
 * Queued operations are persisted locally and synced when online.
 * 
 * NOTE: This is a placeholder. Full implementation will come later.
 */

export interface OutboxEntry {
    id: string;
    type: string;
    payload: unknown;
    createdAt: string;
    attempts: number;
    lastAttemptAt?: string;
    status: 'pending' | 'processing' | 'failed' | 'completed';
}

export interface IOutboxQueue {
    enqueue(type: string, payload: unknown): Promise<string>;
    process(): Promise<void>;
    getAll(): Promise<OutboxEntry[]>;
    getPending(): Promise<OutboxEntry[]>;
    clear(): Promise<void>;
}

// Placeholder implementation
export const OutboxQueue: IOutboxQueue = {
    async enqueue(_type: string, _payload: unknown) {
        return 'placeholder-id';
    },
    async process() {
        // No-op placeholder
    },
    async getAll() {
        return [];
    },
    async getPending() {
        return [];
    },
    async clear() {
        // No-op placeholder
    },
};
