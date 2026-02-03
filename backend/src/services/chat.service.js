import openaiService from './openai.service.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';

class ChatService {
    constructor() {
        // Store conversation history per connection ID
        this.conversations = new Map();
    }

    initConversation(connectionId) {
        this.conversations.set(connectionId, []);
        logger.debug('Conversation initialized', { connectionId });
    }

    addMessage(connectionId, role, content) {
        const history = this.conversations.get(connectionId) || [];
        history.push({ role, content });

        // Limit history length to prevent token limit issues
        if (history.length > config.chat.maxHistoryLength) {
            history.shift();
            history.shift(); // Remove both user and assistant messages
        }

        this.conversations.set(connectionId, history);
    }

    getHistory(connectionId) {
        return this.conversations.get(connectionId) || [];
    }

    clearConversation(connectionId) {
        this.conversations.delete(connectionId);
        logger.debug('Conversation cleared', { connectionId });
    }

    async *streamResponse(connectionId, userMessage) {
        try {
            // Add user message to history
            this.addMessage(connectionId, 'user', userMessage);

            // Get formatted messages for OpenAI
            const history = this.getHistory(connectionId);
            const messages = openaiService.formatMessages(history);

            // Create streaming chat completion
            const stream = await openaiService.createChatStream(messages);

            let assistantMessage = '';

            // Yield chunks as they arrive
            for await (const chunk of stream) {
                const token = chunk.choices[0]?.delta?.content;
                if (token) {
                    assistantMessage += token;
                    yield token;
                }
            }

            // Add assistant response to history
            this.addMessage(connectionId, 'assistant', assistantMessage);

        } catch (error) {
            logger.error('Chat stream error', {
                connectionId,
                error: error.message,
            });
            throw error;
        }
    }

    getActiveConversationsCount() {
        return this.conversations.size;
    }
}

export default new ChatService();
