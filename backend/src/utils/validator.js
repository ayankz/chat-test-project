export function validateMessage(data) {
    if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Invalid message format' };
    }

    if (data.type !== 'message') {
        return { valid: false, error: 'Invalid message type' };
    }

    if (!data.content || typeof data.content !== 'string') {
        return { valid: false, error: 'Message content is required and must be a string' };
    }

    if (data.content.trim().length === 0) {
        return { valid: false, error: 'Message content cannot be empty' };
    }

    if (data.content.length > 10000) {
        return { valid: false, error: 'Message content is too long (max 10000 characters)' };
    }

    return { valid: true };
}

export function safeJsonParse(str) {
    try {
        return { success: true, data: JSON.parse(str) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
