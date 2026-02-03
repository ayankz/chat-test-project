import OpenAI from 'openai';
import config from '../config/index.js';
import logger from '../utils/logger.js';

class OpenAIService {
    constructor() {
        this.client = new OpenAI({
            apiKey: config.openai.apiKey,
        });
    }

    async createChatStream(messages) {
        try {
            const stream = await this.client.chat.completions.create({
                model: config.openai.model,
                messages,
                stream: true,
            });

            return stream;
        } catch (error) {
            logger.error('OpenAI API error', {
                error: error.message,
                code: error.code,
            });
            throw error;
        }
    }

    formatMessages(history) {
        return history.map(msg => ({
            role: msg.role,
            content: msg.content,
        }));
    }
}

export default new OpenAIService();
