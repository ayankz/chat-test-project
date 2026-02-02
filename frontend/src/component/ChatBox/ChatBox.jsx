import { useState } from "react";
import "./ChatBox.css"
import {useVoiceInput} from "../../hooks/useVoiceInput.jsx";

export default function ChatBox({ onSendMessage }) {
    const [message, setMessage] = useState("");
    const { listening, startListening, stopListening } = useVoiceInput((text) => {
        setMessage(text);
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        onSendMessage(message);
        setMessage('');
    };

    return (
        <div className="chat-box">
            <form className="form" onSubmit={handleSubmit}>
                {!listening && (<img src="/mic.svg" alt="mic" onClick={listening ? stopListening : startListening} />)}
                {listening && <span className="mic-ring"></span>}
                <textarea
                    className="input"
                    placeholder="Ask whatever you want"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={1}
                />
                <button className="button" type="submit">
                    <img src="/send.svg" alt="send"/>
                </button>
            </form>
        </div>
    );
}
