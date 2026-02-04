/**
 * Event Domain Models (Placeholder)
 * 
 * Event: physical attendance quest with QR ticket and check-in.
 * User registers → receives QR ticket → checks in at venue → awards CIQ/Points.
 * 
 * NOTE: This is a placeholder. Event functionality is not yet implemented.
 */

import type { BaseQuest } from '../quests/models';

/** Event-specific quest type */
export interface EventQuest extends BaseQuest {
    type: 'event';

    /** Venue information */
    venue: EventVenue;

    /** Maximum number of attendees */
    maxAttendees?: number;

    /** Current registration count */
    registeredCount: number;

    /** Event timing */
    eventDate: string;
    eventStartTime: string;
    eventEndTime: string;

    /** Check-in window (minutes before/after event start) */
    checkInWindowMinutes: number;
}

export interface EventVenue {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

/** User's event registration */
export interface EventRegistration {
    id: string;
    eventId: string;
    userId: string;
    ticketCode: string; // QR code payload
    registeredAt: string;
    checkedInAt?: string;
    status: EventRegistrationStatus;
}

export type EventRegistrationStatus =
    | 'registered'
    | 'checked_in'
    | 'cancelled'
    | 'no_show';
