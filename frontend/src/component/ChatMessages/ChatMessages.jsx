import './ChatMessages.css'
import {useEffect, useRef} from "react";


export default function ChatMessages({ messages }) {
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-container">
            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={msg.role === "user" ? "message user" : "message assistant"}
                >
                    {msg.content}
                </div>
            ))}

            <div ref={chatEndRef} />
        </div>
    );
}