import dotenv from 'dotenv';

dotenv.config();

export const config = {
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    },
    server: {
        port: parseInt(process.env.PORT, 10) || 3001,
        env: process.env.NODE_ENV || 'development',
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_MS, 10) || 3000,
    },
    chat: {
        maxHistoryLength: parseInt(process.env.MAX_HISTORY_LENGTH, 10) || 20,
    },
};

// Validate required environment variables
if (!config.openai.apiKey) {
    throw new Error('OPENAI_API_KEY is required in environment variables');
}

export default config;
