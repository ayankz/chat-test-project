import './ChatMessages.css'
import {useEffect, useRef, memo} from "react";


function ChatMessages({ messages, isLoading }) {
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-container">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={msg.role === "user" ? "message user" : "message assistant"}
                >
                    {msg.content}
                </div>
            ))}
            {isLoading && (
                <div className="message assistant loading">
                    <span className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>
    );
}

export default memo(ChatMessages);