/**
 * Location Service (Placeholder)
 * 
 * Wrapper for expo-location providing geolocation functionality.
 * 
 * NOTE: This is a placeholder. Implementation pending.
 */

export interface LocationCoordinates {
    latitude: number;
    longitude: number;
    accuracy?: number;
}

export interface ILocationService {
    getCurrentLocation(): Promise<LocationCoordinates>;
    requestPermissions(): Promise<boolean>;
    hasPermissions(): Promise<boolean>;
}

// Placeholder implementation
export const LocationService: ILocationService = {
    async getCurrentLocation() {
        throw new Error('Not implemented');
    },
    async requestPermissions() {
        return false;
    },
    async hasPermissions() {
        return false;
    },
};
