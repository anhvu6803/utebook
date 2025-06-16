import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import './styles/VoiceRecognizer.scss';
import { HelpCircle, AudioLines, MicVocal, HeadphoneOff, Check } from 'lucide-react';

const socket = io("http://localhost:8080");

const VoiceRecognizer = ({
    handlPauseSpeech,
    handleResumeSpeech,
    handleReadingCurrentPage,
    handleStopSpeech,
    textChunks,
}) => {
    const isLoopingRef = useRef(false);
    const isProcessingRef = useRef(false);
    const textReadingRef = useRef(null);

    const [text, setText] = useState("");
    const [isLooping, setIsLooping] = useState(false);
    const [showDots, setShowDots] = useState(false);

    useEffect(() => {
        textReadingRef.current = textChunks;
    }, [textChunks]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("✅ Đã kết nối socket");
        });

        socket.on("start_recording", (data) => {
            setText(data.message || "🎤 Đang ghi âm...");
        });

        socket.on("voice_detected", (data) => {
            setText(data.message || "🗣️ Đã phát hiện giọng nói...");
        });

        socket.on("end_recording", () => {
            setText("🕐 Đang xử lý...");
        });

        socket.on("result_text", (data) => {
            isProcessingRef.current = false;

            if (data.status === "success") {
                setText(`✅ ${data.text}`);

                const text = data.text.toLowerCase();
                if (text.includes("tạm dừng")) handlPauseSpeech();
                if (text.includes("tiếp tục")) handleResumeSpeech();
                if (text.includes("bắt đầu")) handleReadingCurrentPage(textReadingRef.current);
                if (text.includes("kết thúc")) handleStopSpeech();
            } else {
                setText(`❌ ${data.message}`);
            }

            // 🔁 Tiếp tục vòng lặp nếu còn bật
            if (isLoopingRef.current) {
                setTimeout(callVoiceAPI, 500); // delay ngắn để tránh overload
            }
        });

        return () => {
            socket.off("connect");
            socket.off("start_recording");
            socket.off("voice_detected");
            socket.off("end_recording");
            socket.off("result_text");
        };
    }, []);

    const callVoiceAPI = async () => {
        if (isProcessingRef.current) return; // ⛔ tránh gọi đè khi chưa xử lý xong

        try {
            isProcessingRef.current = true;
            setText("⏳ Đang gửi yêu cầu tới server...");
            await axios.get("http://localhost:8080/api/voice-to-text");
        } catch (err) {
            setText("❌ Lỗi kết nối API.");
            isProcessingRef.current = false;

            if (isLoopingRef.current) {
                setTimeout(callVoiceAPI, 1000); // thử lại sau 1s nếu có lỗi
            }
        }
    };

    const toggleLoop = () => {
        const newState = !isLooping;
        setIsLooping(newState);
        isLoopingRef.current = newState;
        isProcessingRef.current = false;
        setText("");
        setShowDots(newState);

        if (newState) {
            callVoiceAPI(); // 🚀 bắt đầu vòng lặp
        }
    };

    const handleShowIcon = () => {
        if (text.includes("🎤")) return <MicVocal className='icon' />;
        if (text.includes("✅")) return <Check className='icon' />;
        if (text.includes("❌")) return <HeadphoneOff className='icon' />;
        return <AudioLines className='icon' />;
    };

    return (
        <button className='support-button' onClick={toggleLoop}>
            {showDots ? (
                <>
                    {handleShowIcon()}
                    <div className='dots'>
                        <div className='dot'></div>
                        <div className='dot'></div>
                        <div className='dot'></div>
                    </div>
                </>
            ) : (
                <>
                    <AudioLines className='icon' />
                    <span className='text'>Hỗ trợ</span>
                </>
            )}
        </button>
    );
};

export default VoiceRecognizer;
