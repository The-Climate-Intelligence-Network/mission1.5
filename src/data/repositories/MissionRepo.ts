/**
 * Mission Repository (Placeholder)
 * 
 * Data access layer for Mission entities.
 * This will be implemented when consolidating data access.
 */

import type { MissionQuest, MissionSubmission } from '../../domain';

export interface IMissionRepository {
    getAll(): Promise<MissionQuest[]>;
    getById(id: string): Promise<MissionQuest | null>;
    getSubmissions(missionId: string): Promise<MissionSubmission[]>;
    submitMission(missionId: string, evidence: unknown): Promise<MissionSubmission>;
}

// Placeholder implementation
export const MissionRepo: IMissionRepository = {
    async getAll() {
        return [];
    },
    async getById(_id: string) {
        return null;
    },
    async getSubmissions(_missionId: string) {
        return [];
    },
    async submitMission(_missionId: string, _evidence: unknown) {
        throw new Error('Not implemented');
    },
};
