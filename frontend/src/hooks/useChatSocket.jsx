import { useEffect, useRef, useState } from 'react';
import WebSocketService from '../services/websocket';

function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useChatSocket() {
    const wsServiceRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [error, setError] = useState(null);

    useEffect(() => {
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
        const wsService = new WebSocketService(wsUrl);
        wsServiceRef.current = wsService;

        const handleMessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'chunk') {
                    setMessages((prev) => {
                        const last = prev[prev.length - 1];
                        if (last?.role === 'assistant') {
                            return [
                                ...prev.slice(0, -1),
                                { ...last, content: last.content + data.content },
                            ];
                        }
                        return [...prev, { id: generateId(), role: 'assistant', content: data.content }];
                    });
                }

                if (data.type === 'done') {
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Failed to parse message:', err);
                setError('Failed to parse server response');
            }
        };

        const handleOpen = () => {
            setConnectionStatus('connected');
            setError(null);
        };

        const handleClose = () => {
            setConnectionStatus('disconnected');
        };

        const handleError = (err) => {
            setConnectionStatus('error');
            setError('Connection error occurred');
            console.error('WebSocket error:', err);
        };

        wsService.on('message', handleMessage);
        wsService.on('open', handleOpen);
        wsService.on('close', handleClose);
        wsService.on('error', handleError);

        wsService.connect().catch((err) => {
            console.error('Failed to connect:', err);
            setError('Failed to connect to server');
        });

        return () => {
            wsService.off('message', handleMessage);
            wsService.off('open', handleOpen);
            wsService.off('close', handleClose);
            wsService.off('error', handleError);
            wsService.close();
        };
    }, []);

    const sendMessage = (content) => {
        if (!wsServiceRef.current?.isConnected()) {
            setError('Not connected to server');
            return;
        }

        setMessages((prev) => [...prev, { id: generateId(), role: 'user', content }]);
        setIsLoading(true);

        const success = wsServiceRef.current.send({
            type: 'message',
            content,
        });

        if (!success) {
            setError('Failed to send message');
            setIsLoading(false);
        }
    };

    return { messages, sendMessage, isLoading, connectionStatus, error };
}
