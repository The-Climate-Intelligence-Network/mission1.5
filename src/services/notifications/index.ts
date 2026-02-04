/**
 * Notifications Service (Placeholder)
 * 
 * Wrapper for push notification handling.
 * 
 * NOTE: This is a placeholder. Implementation pending.
 */

export interface NotificationPayload {
    title: string;
    body: string;
    data?: Record<string, unknown>;
}

export interface INotificationsService {
    requestPermissions(): Promise<boolean>;
    hasPermissions(): Promise<boolean>;
    getToken(): Promise<string | null>;
    scheduleLocal(notification: NotificationPayload, triggerAt: Date): Promise<string>;
    cancelAll(): Promise<void>;
}

// Placeholder implementation
export const NotificationsService: INotificationsService = {
    async requestPermissions() {
        return false;
    },
    async hasPermissions() {
        return false;
    },
    async getToken() {
        return null;
    },
    async scheduleLocal(_notification: NotificationPayload, _triggerAt: Date) {
        return 'placeholder-id';
    },
    async cancelAll() {
        // No-op
    },
};
