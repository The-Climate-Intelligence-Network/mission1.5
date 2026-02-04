/**
 * Event Repository (Placeholder)
 * 
 * Data access layer for Event entities.
 * This will be implemented when event functionality is added.
 */

import type { EventQuest, EventRegistration } from '../../domain';

export interface IEventRepository {
    getAll(): Promise<EventQuest[]>;
    getById(id: string): Promise<EventQuest | null>;
    getUpcoming(): Promise<EventQuest[]>;
    register(eventId: string): Promise<EventRegistration>;
    checkIn(eventId: string, ticketCode: string): Promise<EventRegistration>;
}

// Placeholder implementation
export const EventRepo: IEventRepository = {
    async getAll() {
        return [];
    },
    async getById(_id: string) {
        return null;
    },
    async getUpcoming() {
        return [];
    },
    async register(_eventId: string) {
        throw new Error('Not implemented');
    },
    async checkIn(_eventId: string, _ticketCode: string) {
        throw new Error('Not implemented');
    },
};
