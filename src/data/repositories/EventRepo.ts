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
        return MOCK_EVENTS;
    },
    async getById(id: string) {
        return MOCK_EVENTS.find(e => e.id === id) || null;
    },
    async getUpcoming() {
        // Return events in the future (mock logic: just return all for now)
        return MOCK_EVENTS;
    },
    async register(_eventId: string) {
        throw new Error('Not implemented');
    },
    async checkIn(_eventId: string, _ticketCode: string) {
        throw new Error('Not implemented');
    },
};

const MOCK_EVENTS: EventQuest[] = [
    {
        id: 'evt_001',
        type: 'event',
        title: 'Beach Cleanup Drive',
        description: 'Join us for a community beach cleanup event. Bags and gloves provided.',
        imageUrl: 'https://images.unsplash.com/photo-1618477461853-5d8ddf623630',
        status: 'active',
        ciqReward: 500,
        pointsReward: 300,
        startDate: '2024-03-15T09:00:00Z',
        endDate: '2024-03-15T12:00:00Z',
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-02-01T10:00:00Z',
        venue: {
            name: 'Santa Monica Peak',
            address: 'Pacific Coast Hwy, Santa Monica, CA',
            latitude: 34.0195,
            longitude: -118.4912
        },
        maxAttendees: 50,
        registeredCount: 32,
        eventDate: 'Mar 15, 2024',
        eventStartTime: '09:00 AM',
        eventEndTime: '12:00 PM',
        checkInWindowMinutes: 30
    },
    {
        id: 'evt_002',
        type: 'event',
        title: 'Urban Gardening Workshop',
        description: 'Learn how to grow your own food in small urban spaces.',
        imageUrl: 'https://images.unsplash.com/photo-1622383563227-04401cd458b6',
        status: 'active',
        ciqReward: 300,
        pointsReward: 150,
        startDate: '2024-03-20T14:00:00Z',
        endDate: '2024-03-20T16:00:00Z',
        createdAt: '2024-02-05T10:00:00Z',
        updatedAt: '2024-02-05T10:00:00Z',
        venue: {
            name: 'Community Center',
            address: '123 Main St, Cityville',
            latitude: 34.0522,
            longitude: -118.2437
        },
        maxAttendees: 30,
        registeredCount: 28,
        eventDate: 'Mar 20, 2024',
        eventStartTime: '02:00 PM',
        eventEndTime: '04:00 PM',
        checkInWindowMinutes: 15
    },
    {
        id: 'evt_003',
        type: 'event',
        title: 'Recycling Sort-a-thon',
        description: 'Help sort recyclables and learn about waste management.',
        imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
        status: 'active',
        ciqReward: 400,
        pointsReward: 200,
        startDate: '2024-03-25T10:00:00Z',
        endDate: '2024-03-25T14:00:00Z',
        createdAt: '2024-02-10T10:00:00Z',
        updatedAt: '2024-02-10T10:00:00Z',
        venue: {
            name: 'Recycling Plant',
            address: '456 Industrial Way',
            latitude: 34.0407,
            longitude: -118.2468
        },
        maxAttendees: 100,
        registeredCount: 45,
        eventDate: 'Mar 25, 2024',
        eventStartTime: '10:00 AM',
        eventEndTime: '02:00 PM',
        checkInWindowMinutes: 60
    }
];
