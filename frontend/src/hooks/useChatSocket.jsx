import { useEffect, useRef, useState } from 'react';



export function useChatSocket() {
    const socketRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001');
        socketRef.current = ws;

        ws.onmessage = (event) => {
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
                    return [...prev, { role: 'assistant', content: data.content }];
                });
            }

            if (data.type === 'done') {
                setIsLoading(false);
            }
        };

        return () => {
            ws.onmessage = null;
            ws.close();
        };
    }, []);

    const sendMessage = (content) => {
        if (!socketRef.current) return;

        setMessages((prev) => [...prev, { role: 'user', content }]);
        setIsLoading(true);

        socketRef.current.send(
            JSON.stringify({
                type: 'message',
                content,
            })
        );
    };

    return { messages, sendMessage, isLoading };
}
