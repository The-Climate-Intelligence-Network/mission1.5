import { Tables } from "@/src/core/types/database.types";

export type Mission = Tables<"missions">;
export type MissionSubmission = Tables<"mission_submissions">;
export type MissionBookmark = Tables<"mission_bookmarks">;

export interface MissionWithStats extends Mission {
    organization_name?: string;
    participants_count?: number;
    submissions_count?: number;
    completed_submissions_count?: number;
    is_bookmarked?: boolean;
    submission_status?: string | null;
    submission_progress?: number;
    thumbnailUrl?: string | null;
    category?: string;
    ciq_reward?: number;
    time_estimate?: string;
    difficulty?: string;
    submission_type?: string;
}

export interface GuidanceStep {
    id: string;
    icon: string;
    title: string;
    description: string;
    requiredEvidence: string[];
}

export interface EvidenceItem {
    type: "photo" | "video" | "text";
    data: string; // For photos/videos: storage path, for text: the text content
    metadata?: Record<string, any>; // Additional metadata like file size, duration, etc.
    uploadedAt: string;
}

export interface StepEvidence {
    stepId: string;
    evidence: EvidenceItem[];
    completedAt?: string;
    notes?: string;
}

export interface SubmissionProgress {
    submissionId: string;
    missionId: string;
    status: string;
    stepsCompleted: Record<string, StepEvidence>;
    currentStepIndex: number;
    totalSteps: number;
    progressPercentage: number;
    lastUpdated: string;
}
