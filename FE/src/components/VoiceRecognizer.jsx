import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import vad from 'voice-activity-detection';
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
    const [text, setText] = useState("Đang kết nối...");
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showDots, setShowDots] = useState(false);

    const audioContextRef = useRef(null);
    const vadCleanupRef = useRef(null);
    const streamRef = useRef(null);
    const startVADRef = useRef(false);
    const recognitionRef = useRef(null);         // Dùng để giữ instance của SpeechRecognition
    const isRecognizingRef = useRef(false);      // Dùng để kiểm tra trạng thái đang nhận diện
    const textReadingRef = useRef([]);

    useEffect(() => {
        textReadingRef.current = textChunks;
    }, [textChunks]);

    const setupVAD = async () => {
        if (startVADRef.current) {
            console.log('✅ Đã khởi tạo VAD');
            if (audioContextRef.current || streamRef.current) {
                console.warn('⚠️ VAD đã được bật. Không khởi tạo lại.');
                return;
            }

            try {
                // Khởi tạo stream micro với cấu hình giảm nhiễu
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100,
                    },
                });
                streamRef.current = stream;

                // Khởi tạo AudioContext
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContext();
                audioContextRef.current = audioContext;

                // Cấu hình VAD
                const options = {
                    onVoiceStart: () => {
                        console.log('🎤 Phát hiện đang nói...');
                        startSpeechRecognition(stream); // Truyền stream vào
                    },
                    onVoiceStop: () => {
                        console.log('🔇 Dừng nói...');
                        if (recognitionRef.current) {
                            recognitionRef.current.stop();
                        }
                    },
                    interval: 100,
                    energyOffset: 1.0,
                };

                const stopVAD = vad(audioContext, stream, options);
                if (typeof stopVAD === 'function') {
                    vadCleanupRef.current = stopVAD;
                } else {
                    console.warn('⚠️ VAD không trả về hàm dọn dẹp.');
                }
            } catch (err) {
                console.error('🚫 Lỗi khi khởi tạo VAD:', err);
                setText('🚫 Lỗi khi khởi tạo VAD');
            }
        } else {
            console.log('🛑 Tắt VAD');
            setText('🛑 Tắt VAD');

            // Dọn dẹp
            if (typeof vadCleanupRef.current === 'function') {
                vadCleanupRef.current();
                vadCleanupRef.current = null;
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            if (recognitionRef.current) {
                recognitionRef.current.abort();
                recognitionRef.current = null;
            }
            isRecognizingRef.current = false;
        }
    };
    const startSpeechRecognition = (stream) => {
        if (isRecognizingRef.current) {
            console.warn('🔁 Đang nhận diện, không khởi động lại.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error('🚫 Trình duyệt không hỗ trợ Web Speech API.');
            setText('🚫 Trình duyệt không hỗ trợ Web Speech API.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        isRecognizingRef.current = true;
        recognitionRef.current = recognition;

        console.log('🎙️ Đang lắng nghe giọng nói...');

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            console.log('🗣️ Bạn vừa nói:', transcript);
            setText(`🗣️ Bạn vừa nói: ${transcript}`);

            if (transcript.includes('xin chào')) {
                console.log('✅ Đã phát hiện câu lệnh "xin chào"');
                triggerAPI();
            } else {
                console.log('❌ Không khớp với câu lệnh yêu cầu');
            }
        };

        recognition.onerror = (event) => {
            console.error('❗ Lỗi nhận diện:', event.error);
            isRecognizingRef.current = false;
            setText(`❗ Lỗi nhận diện: ${event.error}`);
        };

        recognition.onend = () => {
            console.log('🛑 Nhận diện kết thúc.');
            isRecognizingRef.current = false;
        };

        recognition.start();
    };

    useEffect(() => {
        const handleToggleVAD = () => {
            setupVAD();
        };

        document.addEventListener("startVAD", handleToggleVAD);
        return () => {
            document.removeEventListener("startVAD", handleToggleVAD);
        };
    }, []);

    useEffect(() => {
        socket.on("connect", () => {
            setText("🟢 Đã kết nối với server. Bấm để bắt đầu.");
        });

        socket.on("start_recording", (data) => {
            setText(data.message || "🎤 Đang ghi âm...");
            setIsRecording(true);
        });

        socket.on("result_text", (data) => {
            if (data.status === "success") {
                setText(`✅ ${data.text}`);
                if (data.text.includes("tạm dừng")) {
                    handlPauseSpeech();
                }
                if (data.text.includes("tiếp tục")) {
                    handleResumeSpeech();
                }
                if (data.text.includes("bắt đầu")) {
                    handleReadingCurrentPage(textReadingRef.current);
                }
                if (data.text.includes("kết thúc")) {
                    handleStopSpeech();
                }
            } else {
                setText(`❌ ${data.message || "Lỗi không xác định"}`);
            }
            setIsRecording(false);
        });

        socket.on("disconnect", () => {
            setText("🔌 Mất kết nối với server");
        });

        return () => {
            socket.off("start_recording");
            socket.off("result_text");
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    const triggerAPI = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            setText("⏳ Gửi yêu cầu tới server...");
            const response = await axios.get("http://localhost:8080/api/voice-to-text");
            console.log(response.data.success);
        } catch (err) {
            setError("❌ Lỗi gọi API");
            setText("Lỗi khi kết nối tới server.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleStartVAD = () => {
        startVADRef.current = !startVADRef.current;
        document.dispatchEvent(new Event('startVAD'));
        setShowDots(!showDots);
    };

    const handleShowIcon = () => {
        if (text.includes("🎤")) {
            return <MicVocal className='icon' />
        }
        if (text.includes("✅")) {
            return <Check className='icon' />
        }
        if (text.includes("❌")) {
            return <HeadphoneOff className='icon' />
        }
        return <AudioLines className='icon' />
    };

    return (
        <button className='support-button'
            onClick={handleStartVAD}
        >
            {showDots ?
                (
                    <>
                        {handleShowIcon()}
                        <div className='dots'>
                            <div className='dot'></div>
                            <div className='dot'></div>
                            <div className='dot'></div>
                        </div>
                    </>
                )
                :
                (
                    <>
                        <HelpCircle className='icon' />
                        <span className='text'>Hỗ trợ</span>
                    </>
                )
            }
        </button>
    );
};

export default VoiceRecognizer;
