class WebSocketService {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.listeners = {
            message: [],
            open: [],
            close: [],
            error: [],
        };
    }

    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url);

                this.ws.onopen = () => {
                    this.reconnectAttempts = 0;
                    this.listeners.open.forEach(callback => callback());
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    this.listeners.message.forEach(callback => callback(event));
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.listeners.error.forEach(callback => callback(error));
                };

                this.ws.onclose = () => {
                    this.listeners.close.forEach(callback => callback());
                    this.attemptReconnect();
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * this.reconnectAttempts;

        console.log(`Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

        setTimeout(() => {
            this.connect();
        }, delay);
    }

    send(data) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
            return true;
        }
        console.warn('WebSocket is not open. Current state:', this.ws?.readyState);
        return false;
    }

    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    close() {
        this.maxReconnectAttempts = 0; // Prevent reconnection
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    getReadyState() {
        return this.ws?.readyState;
    }

    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}

export default WebSocketService;