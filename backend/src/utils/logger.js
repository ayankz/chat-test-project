import config from '../config/index.js';

const LogLevel = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG',
};

class Logger {
    constructor() {
        this.isDevelopment = config.server.env === 'development';
    }

    _log(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...meta,
        };

        const formattedMessage = this.isDevelopment
            ? `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`
            : JSON.stringify(logEntry);

        console.log(formattedMessage);
    }

    error(message, meta) {
        this._log(LogLevel.ERROR, message, meta);
    }

    warn(message, meta) {
        this._log(LogLevel.WARN, message, meta);
    }

    info(message, meta) {
        this._log(LogLevel.INFO, message, meta);
    }

    debug(message, meta) {
        if (this.isDevelopment) {
            this._log(LogLevel.DEBUG, message, meta);
        }
    }
}

export default new Logger();
