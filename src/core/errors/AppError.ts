/**
 * Application Error Classes
 * 
 * Custom error types for structured error handling throughout the app.
 * Domain layer should throw these errors; UI layer catches and displays.
 */

export class AppError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class NetworkError extends AppError {
    constructor(message: string, cause?: unknown) {
        super(message, 'NETWORK_ERROR', cause);
        this.name = 'NetworkError';
    }
}

export class AuthError extends AppError {
    constructor(message: string, cause?: unknown) {
        super(message, 'AUTH_ERROR', cause);
        this.name = 'AuthError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string, cause?: unknown) {
        super(message, 'VALIDATION_ERROR', cause);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, cause?: unknown) {
        super(`${resource} not found`, 'NOT_FOUND', cause);
        this.name = 'NotFoundError';
    }
}
