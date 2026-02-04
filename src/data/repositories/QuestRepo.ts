/**
 * Quest Repository (Placeholder)
 * 
 * Data access layer for Quest entities (both Missions and Events).
 * This will be implemented when consolidating data access.
 */

import type { Quest } from '../../domain';

export interface IQuestRepository {
    getAll(): Promise<Quest[]>;
    getById(id: string): Promise<Quest | null>;
    getByType(type: 'mission' | 'event'): Promise<Quest[]>;
}

// Placeholder implementation - will be filled during data layer consolidation
export const QuestRepo: IQuestRepository = {
    async getAll() {
        return [];
    },
    async getById(_id: string) {
        return null;
    },
    async getByType(_type: 'mission' | 'event') {
        return [];
    },
};
