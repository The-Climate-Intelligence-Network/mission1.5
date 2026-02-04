/**
 * Camera Service (Placeholder)
 * 
 * Wrapper for expo-camera and expo-image-picker.
 * 
 * NOTE: This is a placeholder. Implementation pending.
 */

export interface CapturedMedia {
    uri: string;
    type: 'photo' | 'video';
    width?: number;
    height?: number;
}

export interface ICameraService {
    takePhoto(): Promise<CapturedMedia | null>;
    pickImage(): Promise<CapturedMedia | null>;
    requestPermissions(): Promise<boolean>;
    hasPermissions(): Promise<boolean>;
}

// Placeholder implementation
export const CameraService: ICameraService = {
    async takePhoto() {
        return null;
    },
    async pickImage() {
        return null;
    },
    async requestPermissions() {
        return false;
    },
    async hasPermissions() {
        return false;
    },
};
