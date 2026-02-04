/**
 * Files Service (Placeholder)
 * 
 * Wrapper for expo-file-system and expo-document-picker.
 * 
 * NOTE: This is a placeholder. Implementation pending.
 */

export interface FileInfo {
    uri: string;
    name: string;
    size: number;
    mimeType?: string;
}

export interface IFilesService {
    pickDocument(): Promise<FileInfo | null>;
    downloadFile(url: string, filename: string): Promise<string>;
    deleteFile(uri: string): Promise<void>;
    getFileInfo(uri: string): Promise<FileInfo | null>;
}

// Placeholder implementation
export const FilesService: IFilesService = {
    async pickDocument() {
        return null;
    },
    async downloadFile(_url: string, _filename: string) {
        throw new Error('Not implemented');
    },
    async deleteFile(_uri: string) {
        // No-op
    },
    async getFileInfo(_uri: string) {
        return null;
    },
};
