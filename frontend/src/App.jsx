import "./index.css";

import { useCallback } from "react";
import ChatBox from "./components/ChatBox/ChatBox.jsx";
import { useChatSocket } from "./hooks/useChatSocket";
import ChatMessages from "./components/ChatMessages/ChatMessages.jsx";
import MainPage from "./components/MainPage/MainPage.jsx";

export default function App() {
    const { messages, sendMessage, isLoading, connectionStatus, error } = useChatSocket();

    const handleSendMessage = useCallback((message) => {
        sendMessage(message);
    }, [sendMessage]);

    return (
        <div className="screen">
            {messages.length === 0 && (
                <MainPage/>
            )}
            {messages.length > 0 && (
                <ChatMessages messages={messages} isLoading={isLoading} />
            )}
            <ChatBox onSendMessage={handleSendMessage} isLoading={isLoading} connectionStatus={connectionStatus} error={error} />
        </div>
    );
}
