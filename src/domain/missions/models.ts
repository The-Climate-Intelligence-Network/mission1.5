/**
 * Mission Domain Models
 * 
 * Mission: evidence/task-based quest that produces CIQ + pending Points.
 * Missions are submitted for admin approval before rewards are granted.
 */

import type { BaseQuest } from '../quests/models';

/** Mission-specific quest type */
export interface MissionQuest extends BaseQuest {
    type: 'mission';

    /** Evidence requirements for submission */
    evidenceRequirements: EvidenceRequirement[];

    /** Whether the mission requires location verification */
    requiresLocation: boolean;

    /** Optional location coordinates for geo-fenced missions */
    location?: MissionLocation;

    /** Category for filtering/grouping */
    category: MissionCategory;

    /** Difficulty level */
    difficulty: MissionDifficulty;
}

export interface EvidenceRequirement {
    id: string;
    type: 'photo' | 'video' | 'document' | 'text';
    label: string;
    description?: string;
    required: boolean;
}

export interface MissionLocation {
    latitude: number;
    longitude: number;
    radiusMeters: number;
    placeName?: string;
}

export type MissionCategory =
    | 'energy'
    | 'waste'
    | 'transport'
    | 'food'
    | 'advocacy'
    | 'community'
    | 'other';

export type MissionDifficulty = 'easy' | 'medium' | 'hard';

/** Mission submission status */
export type MissionSubmissionStatus =
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'revision_requested';

export interface MissionSubmission {
    id: string;
    missionId: string;
    userId: string;
    status: MissionSubmissionStatus;
    evidence: SubmittedEvidence[];
    submittedAt: string;
    reviewedAt?: string;
    reviewerNotes?: string;
}

export interface SubmittedEvidence {
    requirementId: string;
    type: 'photo' | 'video' | 'document' | 'text';
    url?: string;
    text?: string;
}
