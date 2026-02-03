import config from '../config/index.js';
import logger from '../utils/logger.js';

class RateLimiter {
    constructor() {
        this.requests = new Map();
        this.windowMs = config.rateLimit.windowMs;
    }

    isAllowed(connectionId) {
        const now = Date.now();
        const lastRequest = this.requests.get(connectionId);

        if (!lastRequest) {
            this.requests.set(connectionId, now);
            return true;
        }

        const timeSinceLastRequest = now - lastRequest;

        if (timeSinceLastRequest < this.windowMs) {
            logger.warn('Rate limit exceeded', {
                connectionId,
                timeSinceLastRequest,
                windowMs: this.windowMs,
            });
            return false;
        }

        this.requests.set(connectionId, now);
        return true;
    }

    clear(connectionId) {
        this.requests.delete(connectionId);
    }

    cleanup() {
        // Clean up old entries (older than 1 hour)
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        for (const [id, timestamp] of this.requests.entries()) {
            if (now - timestamp > oneHour) {
                this.requests.delete(id);
            }
        }
    }
}

export default new RateLimiter();
