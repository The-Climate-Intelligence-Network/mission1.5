/**
 * Wallet Domain Models (Placeholder)
 * 
 * Wallet contains user's CIQ and Points balances with transaction ledger.
 * - CIQ (Climate Intelligence Quotient): earned from quests, represents impact
 * - Points: earned from quests, can be redeemed for rewards
 * 
 * NOTE: This is a placeholder. Full wallet/ledger functionality will be implemented later.
 */

/** User's wallet balances */
export interface WalletBalance {
    userId: string;
    ciq: number; // Climate Intelligence Quotient
    points: number;
    lastUpdated: string;
}

/** Transaction types for the ledger */
export type TransactionType =
    | 'quest_completion'
    | 'reward_redemption'
    | 'admin_adjustment'
    | 'referral_bonus'
    | 'expired';

/** Single ledger entry */
export interface LedgerEntry {
    id: string;
    userId: string;
    type: TransactionType;

    /** Positive for credits, negative for debits */
    ciqDelta: number;
    pointsDelta: number;

    /** Balance after this transaction */
    ciqBalance: number;
    pointsBalance: number;

    /** Reference to the source (quest ID, reward ID, etc.) */
    referenceType?: 'quest' | 'reward' | 'referral';
    referenceId?: string;

    description: string;
    createdAt: string;
}

/** Pending rewards (not yet approved) */
export interface PendingReward {
    id: string;
    userId: string;
    questId: string;
    questType: 'mission' | 'event';
    ciqAmount: number;
    pointsAmount: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    resolvedAt?: string;
}
