/**
 * Wallet Repository (Placeholder)
 * 
 * Data access layer for Wallet/Ledger entities.
 * This will be implemented when wallet functionality is added.
 */

import type { WalletBalance, LedgerEntry, PendingReward } from '../../domain';

export interface IWalletRepository {
    getBalance(userId: string): Promise<WalletBalance | null>;
    getLedger(userId: string, limit?: number): Promise<LedgerEntry[]>;
    getPendingRewards(userId: string): Promise<PendingReward[]>;
}

// Placeholder implementation
export const WalletRepo: IWalletRepository = {
    async getBalance(_userId: string) {
        return null;
    },
    async getLedger(_userId: string, _limit?: number) {
        return [];
    },
    async getPendingRewards(_userId: string) {
        return [];
    },
};
