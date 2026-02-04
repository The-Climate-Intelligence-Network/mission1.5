/**
 * Quest Domain Models
 * 
 * Quest is the umbrella type for all activities (Missions and Events).
 * - Mission: evidence/task-based quest with submission for admin approval
 * - Event: physical attendance quest with QR ticket and check-in
 */

import type { MissionQuest } from '../missions/models';
import type { EventQuest } from '../events/models';

/** Quest type discriminator */
export type QuestType = 'mission' | 'event';

/** Union type for all quest variants */
export type Quest = MissionQuest | EventQuest;

/** Quest status applicable to both types */
export type QuestStatus = 'active' | 'completed' | 'expired' | 'draft';

/** Base properties shared by all quest types */
export interface BaseQuest {
    id: string;
    type: QuestType;
    title: string;
    description: string;
    imageUrl?: string;
    status: QuestStatus;
    ciqReward: number; // CIQ (Climate Intelligence Quotient)
    pointsReward: number;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}
