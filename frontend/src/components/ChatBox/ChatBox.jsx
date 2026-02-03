import { useState, useCallback, memo } from "react";
import "./ChatBox.css"
import {useVoiceInput} from "../../hooks/useVoiceInput.jsx";

function ChatBox({ onSendMessage, isLoading, connectionStatus, error }) {
    const [message, setMessage] = useState("");
    const [voiceError, setVoiceError] = useState(null);

    const handleVoiceResult = useCallback((text) => {
        setMessage(text);
        setVoiceError(null);
    }, []);

    const handleVoiceError = useCallback((errorMsg) => {
        setVoiceError(errorMsg);
    }, []);

    const { listening, startListening, isSupported } = useVoiceInput(
        handleVoiceResult,
        handleVoiceError
    );

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;
        onSendMessage(message);
        setMessage('');
    }, [message, isLoading, onSendMessage]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }, [handleSubmit]);

    return (
        <div className="chat-box">
            {(error || voiceError) && (
                <div className="error-message" role="alert" aria-live="polite">
                    {error || voiceError}
                </div>
            )}
            {connectionStatus === 'connecting' && (
                <div className="status-message" role="status" aria-live="polite">
                    Connecting to server...
                </div>
            )}
            {connectionStatus === 'disconnected' && (
                <div className="status-message warning" role="status" aria-live="polite">
                    Reconnecting...
                </div>
            )}
            <form className="form" onSubmit={handleSubmit}>
                {isSupported && (
                    <button
                        type="button"
                        className={`mic-button ${listening ? 'listening' : ''}`}
                        onClick={startListening}
                        aria-label={listening ? "Listening..." : "Start voice input"}
                        disabled={isLoading}
                    >
                        <img src="/mic.svg" alt="" aria-hidden="true" />
                    </button>
                )}
                <textarea
                    className="input"
                    placeholder="Ask whatever you want"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    aria-label="Message input"
                    disabled={isLoading || connectionStatus !== 'connected'}
                />
                <button
                    className="button"
                    type="submit"
                    disabled={!message.trim() || isLoading || connectionStatus !== 'connected'}
                    aria-label="Send message"
                >
                    {isLoading ? (
                        <span className="loading-spinner" aria-label="Sending..."></span>
                    ) : (
                        <img src="/send.svg" alt="" aria-hidden="true" />
                    )}
                </button>
            </form>
        </div>
    );
}

export default memo(ChatBox);
