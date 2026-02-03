import express from 'express';
import chatService from '../services/chat.service.js';
import config from '../config/index.js';

const router = express.Router();

router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.server.env,
    });
});

router.get('/metrics', (req, res) => {
    res.json({
        activeConnections: chatService.getActiveConversationsCount(),
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

export default router;
