/**
 * Telemetry Logger
 * 
 * Structured logging for the application.
 * Placeholder - will be expanded with actual telemetry integration.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    context?: Record<string, unknown>;
    timestamp: string;
}

class Logger {
    private enabled = __DEV__;

    private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
        if (!this.enabled) return;

        const entry: LogEntry = {
            level,
            message,
            context,
            timestamp: new Date().toISOString(),
        };

        switch (level) {
            case 'debug':
                console.debug(`[${entry.timestamp}] DEBUG:`, message, context);
                break;
            case 'info':
                console.info(`[${entry.timestamp}] INFO:`, message, context);
                break;
            case 'warn':
                console.warn(`[${entry.timestamp}] WARN:`, message, context);
                break;
            case 'error':
                console.error(`[${entry.timestamp}] ERROR:`, message, context);
                break;
        }
    }

    debug(message: string, context?: Record<string, unknown>): void {
        this.log('debug', message, context);
    }

    info(message: string, context?: Record<string, unknown>): void {
        this.log('info', message, context);
    }

    warn(message: string, context?: Record<string, unknown>): void {
        this.log('warn', message, context);
    }

    error(message: string, context?: Record<string, unknown>): void {
        this.log('error', message, context);
    }
}

export const logger = new Logger();
