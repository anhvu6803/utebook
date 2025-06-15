// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/ReaderBookPage.scss';
import { ChevronLeft, Headphones, Maximize, Pause, StepForward, X, List, BookOpen } from 'lucide-react';
import { Select, Spin } from 'antd';
import io from 'socket.io-client';
import CustomSlider from '../components/CustomSlider';
import SliderPageReader from '../components/SliderPageReader';
import CircleLoading from '../components/CircleLoading';
import MenuChapter from '../components/MenuChapter';
import SettingsStyle from '../components/SettingsStyle';
// Import text content
//import chapterText from '../assets/chapterText.txt';
const parseChapterName = (chapterName) => {
    const match = chapterName.match(/^Chương\s+(\d+)[\s_:.-]*\s*(.+)?$/i);
    if (match) {
        return {
            chapterNumber: parseInt(match[1], 10),
            title: match[2] ? match[2].trim() : ''
        };
    } else {
        return {
            chapterNumber: null,
            title: chapterName.trim()
        };
    }
};

const sortChapters = (chapterList, reverse = false) => {
    return chapterList
        .map(ch => ({
            ...ch,
            _parsed: parseChapterName(ch.chapterName)
        }))
        .filter(ch => ch._parsed.chapterNumber !== null)
        .sort((a, b) =>
            reverse
                ? b._parsed.chapterNumber - a._parsed.chapterNumber
                : a._parsed.chapterNumber - b._parsed.chapterNumber
        )
        .map(({ _parsed, ...original }) => original); // Trả lại object gốc, bỏ `_parsed`
};

const speedReading = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
]

const ReaderBookPage = () => {
    const { content } = useParams();

    const readingRef = useRef(false);
    const pauseRef = useRef(false);
    const flowReadingRef = useRef(false);
    const loadingButtonRef = useRef(null);
    const playbackRateRef = useRef(1);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(30);
    const [isReading, setIsReading] = useState(readingRef.current);
    const [isLoadingButton, setIsLoadingButton] = useState(loadingButtonRef.current);
    const [isPause, setIsPause] = useState(pauseRef.current);
    const [isLoading, setIsLoading] = useState(true);
    const [textChunks, setTextChunks] = useState([]);
    const [allLines, setAllLines] = useState([]);
    const linesPerSlide = 5; // Number of lines per slide
    const [socket, setSocket] = useState(null);

    const [bookName, setBookName] = useState('');
    const [bookType, setBookType] = useState('');
    const [currentChapterName, setCurrentChapterName] = useState('');
    const [chapters, setChapters] = useState([]);

    const [maxWidth, setMaxWidth] = useState(1000);
    const [fontSize, setFontSize] = useState(26);
    const [fontFamily, setFontFamily] = useState('Netflix Sans');
    const [isPageVertical, setIsPageVertical] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [speedReadingValue, setSpeedReadingValue] = useState(playbackRateRef.current);

    const audioRef = useRef(null);
    const [currentText, setCurrentText] = useState("");
    const [lineIndex, setLineIndex] = useState(null);

    useEffect(() => {
        const socket = io('http://localhost:3000');
        // Nhận dữ liệu âm thanh từ backend
        socket.on("audio_data", (data) => {
            const { audio, text, line_index } = data;
            setCurrentText(text);
            setLineIndex(line_index);

            // Chuyển hex string thành Uint8Array
            const byteArray = new Uint8Array(
                audio.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
            );

            // Tạo Blob và phát âm thanh
            const blob = new Blob([byteArray], { type: "audio/mp3" });
            const url = URL.createObjectURL(blob);

            // Dùng ref để play
            if (audioRef.current) {
                handleChangeSpeed(playbackRateRef.current);
                audioRef.current.src = url;
                audioRef.current.play();
            }
        });

        socket.on("reading_completed", () => {
            console.log("🎉 Đọc hoàn tất");
            setCurrentText("");
            setLineIndex(null);
        });

        audioRef.current.onended = () => {
            console.log("Đã phát xong âm thanh");
            socket.emit("audio_played_done"); // Gửi về backend để báo dòng này xong
        };

        return () => {
            socket.off("audio_data");
            socket.off("reading_completed");
        };
    }, []);

    useEffect(() => {

        const newSocket = io('http://localhost:3000'); // Điều chỉnh URL phù hợp với máy chủ của bạn

        newSocket.on('reading_completed', (data) => {
            console.log('Đã nhận sự kiện reading_completed:', data);
            readingRef.current = data.is_reading;
            setIsReading(readingRef.current);

            if (!data.is_reading) {
                console.log('Đọc văn bản đã hoàn tất');
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleGenerateText = async (drive_link) => {
        const response = await axios.post(
            'http://localhost:3000/api/get_drive',
            { drive_link: drive_link }
        );

        // Lấy văn bản từ phản hồi API
        const chapterText = response.data.text;

        // Tiến hành xử lý văn bản sau khi nhận được
        const allLines = chapterText.split('\n').filter(line => line.trim() !== '');

        return allLines;
    };

    const changeScrollVertical = () => {
        const chunks = [[...allLines]];
        setTextChunks(chunks);
        setTotalPages(1);
        console.log('allLines', chunks);
    };

    const handleSeperateText = (allLines, fontSize, fontFamily,) => {

        const calculateTextHeight = (lines) => {
            // Tạo element tạm thời để đo chiều cao chính xác
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.visibility = 'hidden';
            tempDiv.style.top = '-9999px';
            tempDiv.style.left = '-9999px';
            tempDiv.style.width = maxWidth + 'px';
            tempDiv.style.fontSize = fontSize + 'px'; // Điều chỉnh theo font size thực tế
            tempDiv.style.lineHeight = '1.5'; // Điều chỉnh theo line height thực tế
            tempDiv.style.fontFamily = fontFamily; // Điều chỉnh theo font family thực tế
            tempDiv.style.whiteSpace = 'pre-wrap';
            tempDiv.style.boxSizing = 'border-box';
            tempDiv.style.padding = '0';
            tempDiv.style.margin = '0';

            document.body.appendChild(tempDiv);

            // Join lines với <br> để giữ nguyên line breaks
            tempDiv.innerHTML = lines.join('<br>');
            const height = tempDiv.offsetHeight;

            document.body.removeChild(tempDiv);
            return height;
        };

        const chunks = [];
        const maxHeight = 300;

        let currentChunk = [];

        for (let i = 0; i < allLines.length; i++) {
            const testChunk = [...currentChunk, allLines[i]];
            const testHeight = calculateTextHeight(testChunk, maxWidth, fontSize, fontFamily);

            if (testHeight > maxHeight && currentChunk.length > 0) {
                chunks.push([...currentChunk]);
                currentChunk = [allLines[i]];
            } else {
                currentChunk.push(allLines[i]);
            }
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
            console.log(chunks);
        }

        setTextChunks(chunks);
        setTotalPages(chunks.length);
    }
    useEffect(() => {

        const fetchTextFromDrive = async () => {
            try {
                setIsLoading(true);

                const responseChapter = await axios.get(
                    `http://localhost:5000/api/chapter/chapter/${content}`
                );
                if (responseChapter.data.success) {
                    setCurrentChapterName(responseChapter.data.data.chapterName);
                    const idNovel = responseChapter.data.data.bookId;
                    const responseBook = await axios.get(`http://localhost:5000/api/book/books/${idNovel}`);

                    console.log(responseBook.data.data);
                    if (responseBook.data.success) {
                        const bookData = responseBook.data.data;
                        setBookName(bookData.bookname);
                        setBookType(bookData.type);
                        if (bookData.chapterIds !== null) {
                            try {
                                const chapterPromises = bookData.chapterIds.map(async (chapter) => {
                                    try {
                                        const response = await axios.get(`http://localhost:5000/api/chapter/chapter/${chapter}`);
                                        return response.data.data; // trả về data nếu request thành công
                                    } catch (error) {
                                        console.error(`Error fetching chapter ${chapter}:`, error);
                                        return null; // nếu có lỗi, trả về null để không ảnh hưởng đến các chapter khác
                                    }
                                });
                                const chaptersData = await Promise.all(chapterPromises);

                                const validChapters = chaptersData.filter((chapter) => chapter !== null);
                                setChapters(sortChapters(validChapters)); // sắp xếp lịch sử cơ bản (validChapters);
                                console.log(sortChapters(validChapters));
                            } catch (error) {
                                console.error('Error fetching chapters:', error);
                            }
                        }
                    }

                    const tempAllLines = await handleGenerateText(responseChapter.data.data.viewlink);
                    setAllLines(tempAllLines);

                    handleSeperateText(tempAllLines, fontSize, fontFamily);
                }

            } catch (error) {
                console.error('Error fetching or processing the text:', error);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchTextFromDrive();
    }, []);

    const [isFullScreen, setIsFullScreen] = useState(false);

    const checkFullScreen = () => {
        if (document.fullscreenElement) {
            setIsFullScreen(true);
        } else {
            setIsFullScreen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('fullscreenchange', checkFullScreen);
        return () => {
            document.removeEventListener('fullscreenchange', checkFullScreen);
        };
    }, []);

    const enterFullScreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    };

    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    };

    const toggleFullScreen = () => {
        if (isFullScreen) {
            exitFullScreen();
        } else {
            enterFullScreen();
        }
    };
    const handleReadingCurrentPage = async (text) => {
        try {
            loadingButtonRef.current = true;
            flowReadingRef.current = true;
            setIsLoadingButton(loadingButtonRef.current);
            console.log(text);

            const response = await fetch('http://localhost:3000/api/speech_line', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    delay: 0.2
                })
            });
            console.log(response);
        }
        catch (error) {
            console.error('Error fetching speech:', error);
        }
        finally {
            loadingButtonRef.current = false;
            setIsLoadingButton(loadingButtonRef.current);
            readingRef.current = true;
            setIsReading(readingRef.current);
        }
    }
    const handleStopSpeech = async () => {
        readingRef.current = false;
        setIsReading(readingRef.current);
        pauseRef.current = false;
        setIsPause(pauseRef.current);
        flowReadingRef.current = false;

        // 2. Stop audio ngay lập tức
        if (audioRef.current) {
            audioRef.current.pause();      // Dừng phát
            audioRef.current.currentTime = 0; // Quay lại đầu audio
            audioRef.current.src = "";     // Xóa nguồn audio hiện tại (optional)
        }

        await axios.post('http://localhost:3000/api/speech/stop');
    }
    const handlPauseSpeech = async () => {
        pauseRef.current = true;
        setIsPause(pauseRef.current);
        await axios.post('http://localhost:3000/api/speech/pause');
        audioRef.current.pause();
    }
    const handleResumeSpeech = async () => {
        pauseRef.current = false;
        setIsPause(pauseRef.current);
        await axios.post('http://localhost:3000/api/speech/resume');
        audioRef.current.play();
    }
    const handleChangeSpeed = async (value) => {
        try {
            await axios.post('http://localhost:3000/api/speech/set_speed', {
                speed: value
            });
            if (audioRef.current) {
                audioRef.current.playbackRate = value;
                console.log(audioRef.current.playbackRate);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="ebook-reader"
            style={{ color: backgroundColor === '#000' ? 'white' : '#333' }}
        >
            <div className="top-bar">
                <button
                    className="nav-button"
                    onClick={() => window.history.back()}
                >
                    <ChevronLeft />
                </button>
                <div className='title-container'>
                    <h1 className="book-title">{bookName}</h1>
                </div>
                <div className="right-controls">
                    {isReading ?
                        (
                            <>
                                <Select
                                    size='large'
                                    value={speedReadingValue}
                                    onChange={(value) => {
                                        setSpeedReadingValue(value);
                                        playbackRateRef.current = value;
                                        handleChangeSpeed(value);
                                    }}
                                    options={speedReading}
                                />
                                <button
                                    className="control-button"
                                    onClick={() => handleStopSpeech()}
                                >
                                    <X />
                                </button>

                                {isPause ?
                                    (
                                        <button
                                            className="control-button"
                                            onClick={() => handleResumeSpeech()}
                                        >
                                            <StepForward />
                                        </button>
                                    )
                                    :
                                    (
                                        <button
                                            className="control-button"
                                            onClick={() => handlPauseSpeech()}
                                        >
                                            <Pause />
                                        </button>
                                    )

                                }
                            </>
                        )
                        :
                        (
                            <Spin spinning={isLoadingButton}>
                                <button
                                    className="control-button"
                                    onClick={() => handleReadingCurrentPage(textChunks[currentPage - 1])}
                                >
                                    <Headphones />
                                </button>
                            </Spin>
                        )
                    }
                    <MenuChapter
                        currentChapter={content}
                        chapters={chapters}
                        bookName={bookName}
                        bookType={bookType}
                    />
                    <SettingsStyle
                        isPageVertical={isPageVertical}
                        setIsPageVertical={setIsPageVertical}
                        changeScrollVertical={changeScrollVertical}
                        allLines={allLines}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        fontFamily={fontFamily}
                        setFontFamily={setFontFamily}
                        handleSeperateText={handleSeperateText}
                        setBackgroundColor={setBackgroundColor}
                    />
                    <button
                        className="control-button"
                        onClick={toggleFullScreen}
                    >
                        <Maximize />
                    </button>
                </div>
            </div>

            <div className="content-area"
                style={{ backgroundColor: backgroundColor }}
            >
                {isLoading ?
                    <CircleLoading size={100} />
                    :
                    <SliderPageReader
                        textChunks={textChunks}
                        setCurrentPage={setCurrentPage}
                        readingRef={readingRef}
                        flowReadingRef={flowReadingRef}
                        isReading={isReading}
                        setIsReading={setIsReading}
                        fontSize={fontSize}
                        fontFamily={fontFamily}
                        lineIndex={lineIndex}
                        handleReadingCurrentPage={handleReadingCurrentPage}
                    />
                }

            </div>

            <div className="bottom-bar">
                <div className='bottom-bar-text'>
                    <div className="chapter-info">{currentChapterName}</div>
                    <div className="progress-text">{((currentPage / totalPages) * 100).toFixed(0)}%</div>
                </div>

                <div className="progress-container">
                    <CustomSlider
                        value={((currentPage / totalPages) * 100).toFixed(0)}
                        step={(100 / totalPages).toFixed(0)}
                    />
                </div>
            </div>

            <audio ref={audioRef} controls style={{ display: 'none' }} />
        </div>
    );
};

export default ReaderBookPage;