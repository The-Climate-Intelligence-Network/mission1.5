/**
 * Rewards Repository (Placeholder)
 * 
 * Data access layer for Reward entities.
 * This will be implemented when consolidating data access.
 */

import type { Reward, RedeemedReward } from '../../domain';

export interface IRewardsRepository {
    getAll(): Promise<Reward[]>;
    getById(id: string): Promise<Reward | null>;
    getAvailable(): Promise<Reward[]>;
    redeem(rewardId: string): Promise<RedeemedReward>;
    getMyRedemptions(): Promise<RedeemedReward[]>;
}

// Placeholder implementation
export const RewardsRepo: IRewardsRepository = {
    async getAll() {
        return [];
    },
    async getById(_id: string) {
        return null;
    },
    async getAvailable() {
        return [];
    },
    async redeem(_rewardId: string) {
        throw new Error('Not implemented');
    },
    async getMyRedemptions() {
        return [];
    },
};
