import { useState, useRef } from "react";

export function useVoiceInput(onResult) {
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);

    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.lang = "ru-RU";
        recognition.interimResults = true;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join("");
            onResult(transcript);
        };

        recognition.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setListening(false);
    };

    return { listening, startListening, stopListening };
}
