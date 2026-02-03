import { v4 as uuidv4 } from 'uuid';
import chatService from '../services/chat.service.js';
import rateLimiter from '../middleware/rateLimiter.js';
import logger from '../utils/logger.js';
import { validateMessage, safeJsonParse } from '../utils/validator.js';

export function handleConnection(ws) {
    const connectionId = uuidv4();

    logger.info('Client connected', { connectionId });

    // Initialize conversation for this connection
    chatService.initConversation(connectionId);

    ws.on('message', async (rawMessage) => {
        try {
            // Parse JSON message
            const parseResult = safeJsonParse(rawMessage.toString());
            if (!parseResult.success) {
                logger.warn('Invalid JSON received', { connectionId, error: parseResult.error });
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Invalid message format',
                }));
                return;
            }

            const message = parseResult.data;

            // Validate message structure
            const validation = validateMessage(message);
            if (!validation.valid) {
                logger.warn('Message validation failed', { connectionId, error: validation.error });
                ws.send(JSON.stringify({
                    type: 'error',
                    message: validation.error,
                }));
                return;
            }

            // Check rate limit
            if (!rateLimiter.isAllowed(connectionId)) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Too many requests. Please wait before sending another message.',
                }));
                return;
            }

            // Stream response from OpenAI
            logger.debug('Processing message', { connectionId, contentLength: message.content.length });

            for await (const token of chatService.streamResponse(connectionId, message.content)) {
                if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify({
                        type: 'chunk',
                        content: token,
                    }));
                } else {
                    logger.warn('WebSocket closed during streaming', { connectionId });
                    break;
                }
            }

            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ type: 'done' }));
                logger.debug('Message processing completed', { connectionId });
            }

        } catch (error) {
            logger.error('Error processing message', {
                connectionId,
                error: error.message,
                stack: error.stack,
            });

            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'An error occurred while processing your message',
                }));
            }
        }
    });

    ws.on('error', (error) => {
        logger.error('WebSocket error', {
            connectionId,
            error: error.message,
        });
    });

    ws.on('close', () => {
        logger.info('Client disconnected', { connectionId });
        chatService.clearConversation(connectionId);
        rateLimiter.clear(connectionId);
    });
}
