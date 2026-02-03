import { useState, useRef } from "react";

export function useVoiceInput(onResult, onError) {
    const [listening, setListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef(null);

    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            onError?.('Speech recognition is not supported in your browser');
            return;
        }

        try {
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

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setListening(false);

                const errorMessages = {
                    'no-speech': 'No speech detected. Please try again.',
                    'audio-capture': 'Microphone is not available.',
                    'not-allowed': 'Microphone permission denied.',
                    'network': 'Network error occurred.',
                };

                const message = errorMessages[event.error] || `Speech recognition error: ${event.error}`;
                onError?.(message);
            };

            recognition.start();
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
            onError?.('Failed to start speech recognition');
            setListening(false);
        }
    };

    const stopListening = () => {
        try {
            recognitionRef.current?.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
        setListening(false);
    };

    return { listening, startListening, stopListening, isSupported };
}
