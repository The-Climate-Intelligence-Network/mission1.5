/**
 * Data Layer Barrel Export
 * 
 * Exports data access components: client, repositories, queue, and sync.
 */

// Supabase client
export * from './client/supabaseClient';

// Repositories
export * from './repositories/QuestRepo';
export * from './repositories/MissionRepo';
export * from './repositories/EventRepo';
export * from './repositories/RewardsRepo';
export * from './repositories/WalletRepo';

// Queue (offline-first)
export * from './queue/OutboxQueue';

// Sync
export * from './sync/SyncCoordinator';
