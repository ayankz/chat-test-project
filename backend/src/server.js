import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import config from './config/index.js';
import logger from './utils/logger.js';
import healthRoutes from './routes/health.routes.js';
import { handleConnection } from './handlers/websocket.handler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', healthRoutes);

// Start server
const server = app.listen(config.server.port, () => {
    logger.info('Server started', {
        port: config.server.port,
        env: config.server.env,
    });
});

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', handleConnection);

wss.on('error', (error) => {
    logger.error('WebSocket server error', { error: error.message });
});

// Graceful shutdown
function shutdown(signal) {
    logger.info('Shutdown signal received', { signal });

    server.close(() => {
        logger.info('HTTP server closed');
    });

    wss.clients.forEach((client) => {
        client.close(1000, 'Server shutting down');
    });

    wss.close(() => {
        logger.info('WebSocket server closed');
        process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Error handlers
process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', {
        error: error.message,
        stack: error.stack,
    });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection', {
        reason,
        promise,
    });
});

export default server;
