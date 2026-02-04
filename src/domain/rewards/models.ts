/**
 * Rewards Domain Models
 * 
 * Rewards can be redeemed using Points earned from completing quests.
 */

export interface Reward {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    pointsCost: number;
    category: RewardCategory;
    stock?: number; // undefined = unlimited
    expiresAt?: string;
    termsAndConditions?: string;
    status: RewardStatus;
    createdAt: string;
    updatedAt: string;
}

export type RewardCategory =
    | 'voucher'
    | 'merchandise'
    | 'experience'
    | 'donation'
    | 'other';

export type RewardStatus = 'active' | 'out_of_stock' | 'expired' | 'hidden';

/** User's redeemed reward */
export interface RedeemedReward {
    id: string;
    rewardId: string;
    userId: string;
    redemptionCode?: string;
    pointsSpent: number;
    redeemedAt: string;
    usedAt?: string;
    expiresAt?: string;
    status: RedeemedRewardStatus;
}

export type RedeemedRewardStatus =
    | 'pending'
    | 'active'
    | 'used'
    | 'expired'
    | 'cancelled';
