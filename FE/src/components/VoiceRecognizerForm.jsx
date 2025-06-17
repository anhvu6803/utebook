import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import './styles/VoiceRecognizerForm.scss';
import { HelpCircle, AudioLines, MicVocal, HeadphoneOff, Check, Mic } from 'lucide-react';
import LoadingClockAnimation from "./LoadingClockAnimation";
import { Modal } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { set } from "mongoose";

const socket = io("http://localhost:8080");

const VoiceRecognizerForm = ({
    handleVoiceSearch,
    showForm,
    setShowForm,
}) => {
    const isLoopingRef = useRef(false);
    const isProcessingRef = useRef(false);

    const [text, setText] = useState("Tìm kiếm bằng giọng nói");
    const [showText, setShowText] = useState("Tìm kiếm bằng giọng nói");
    const [isLooping, setIsLooping] = useState(false);
    const [showDots, setShowDots] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Đã kết nối socket");
        });

        socket.on("start_recording", (data) => {
            setIsLoading(false);
            setText(data.message || "🎤 Đang ghi âm...");
            setShowText("Hãy nói gì đó! ");
        });

        socket.on("voice_detected", (data) => {
            setText(data.message || "🗣️ Đã phát hiện giọng nói...");
            setShowText("Đã phát hiện giọng nói...");
        });

        socket.on("end_recording", () => {
            setText("🕐 Đang xử lý...");
            setShowText("Đang xử lý...");
            setIsLoading(true);
        });

        socket.on("result_text", (data) => {
            isProcessingRef.current = false;

            if (data.status === "success") {
                setText(`✅ ${data.text}`);
                setShowText(`${data.text}`);
                handleExcuteRequest(data.text);
                setTimeout(() => handleCloseForm(), 1000);
            } else {
                setText(`❌ ${data.message}`);
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
            setText("Chờ trong vài giây");
            await axios.get("http://localhost:8080/api/voice-to-text");
        } catch (err) {
            setText("❌ Lỗi kết nối API.");
            isProcessingRef.current = false;
        }
    };

    const handleShowIcon = () => {
        if (text.includes("🎤")) return <MicVocal className='icon' />;
        if (text.includes("✅")) return <Check className='icon' />;
        if (text.includes("❌")) return <HeadphoneOff className='icon' />;
        if (isLoading) return <LoadingClockAnimation isLoading={isLoading} />;
        return <AudioLines className='icon' />;
    };

    const handleExcuteRequest = (textValue) => {
        const text = textValue.toLowerCase();
        handleVoiceSearch(text);
    }

    const handleSearch = () => {
        setShowForm(true);
        setIsLoading(false);
        setText("Tìm kiếm bằng giọng nói");
        setShowText("Tìm kiếm bằng giọng nói");
        setTimeout(() => toggleLoop(), 1000);
    }

    const toggleLoop = () => {
        setShowDots(true);
        callVoiceAPI(); // 🚀 bắt đầu vòng lặp
    };

    const handleCloseForm = () => {
        setText('');
        setShowDots(false);
        setShowForm(false);
    }
    return (
        <>
            <Mic
                onClick={() => handleSearch()}
                style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                }}
            />
            <Modal open={showForm} onClose={() => handleCloseForm()}>
                <div className="voice-form-container">
                    <div className={`voice-form ${showForm ? "show" : ""}`}>
                        <HighlightOffIcon className="close-icon" onClick={() => handleCloseForm()} />
                        <div className="voice-search-container">
                            <p>{showText}</p>
                            <div className='voice-search-button'>
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
                            </div>
                        </div>

                    </div>
                </div>
            </Modal>
        </>
    );
};

export default VoiceRecognizerForm;
