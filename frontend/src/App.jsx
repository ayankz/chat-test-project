import "./index.css";

import ChatBox from "./component/ChatBox/ChatBox.jsx";
import {useState} from "react";
import { useChatSocket } from "./hooks/useChatSocket";
import ChatMessages from "./component/ChatMessages/ChatMessages.jsx";
import MainPage from "./component/MainPage/MainPage.jsx";

export default function App() {
    const { messages, sendMessage, isLoading } = useChatSocket();
    const [hasSentMessage, setHasSentMessage] = useState(false);

    const handleSendMessage = (message) => {
        if (!hasSentMessage) setHasSentMessage(true);
        console.log('Message sent:', message);
        sendMessage(message);
    };
    return (
        <div className="screen">
            {!hasSentMessage && (
                <MainPage/>
            )}
            {messages.length > 0 && (
                <ChatMessages messages={messages} />
            )}
            <ChatBox onSendMessage={handleSendMessage}/>
        </div>
    );
}
