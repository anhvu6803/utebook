// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/ReaderBookPage.scss';
import { ChevronLeft, Headphones, Maximize, Pause, StepForward, X, List, BookOpen } from 'lucide-react';
import { Spin } from 'antd';
import io from 'socket.io-client';
import CustomSlider from '../components/CustomSlider';
import SliderPageReader from '../components/SliderPageReader';
import CircleLoading from '../components/CircleLoading';
import MenuChapter from '../components/MenuChapter';
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

const ReaderBookPage = () => {
    const { content } = useParams();

    const readingRef = useRef(false);
    const pauseRef = useRef(false);
    const loadingButtonRef = useRef(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(30);
    const [isReading, setIsReading] = useState(readingRef.current);
    const [isLoadingButton, setIsLoadingButton] = useState(loadingButtonRef.current);
    const [isPause, setIsPause] = useState(pauseRef.current);
    const [isLoading, setIsLoading] = useState(true);
    const [textChunks, setTextChunks] = useState([]);
    const linesPerSlide = 5; // Number of lines per slide
    const [socket, setSocket] = useState(null);

    const [bookName, setBookName] = useState('');
    const [currentChapterName, setCurrentChapterName] = useState('');
    const [chapters, setChapters] = useState([]);

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

                    const response = await axios.post(
                        'http://localhost:3000/api/get_drive',
                        { drive_link: responseChapter.data.data.viewlink }
                    );

                    // Lấy văn bản từ phản hồi API
                    const chapterText = response.data.text;

                    // Tiến hành xử lý văn bản sau khi nhận được
                    const allLines = chapterText.split('\n').filter(line => line.trim() !== '');

                    // Chia văn bản thành các nhóm nhỏ mỗi nhóm 5 dòng
                    const chunks = [];
                    for (let i = 0; i < allLines.length; i += linesPerSlide) {
                        chunks.push(allLines.slice(i, i + linesPerSlide));
                    }

                    // Cập nhật state với các đoạn văn bản đã phân nhóm
                    setTextChunks(chunks);
                    setTotalPages(chunks.length);
                }

            } catch (error) {
                console.error('Error fetching or processing the text:', error);
            }
            finally {
                setIsLoading(false);
            }
        };

        // Gọi hàm để tải dữ liệu khi component mount
        fetchTextFromDrive();
    }, []);

    const [isFullScreen, setIsFullScreen] = useState(false);

    // Kiểm tra nếu trình duyệt đang ở chế độ toàn màn hình hay không
    const checkFullScreen = () => {
        if (document.fullscreenElement) {
            setIsFullScreen(true);
        } else {
            setIsFullScreen(false);
        }
    };

    // Lắng nghe sự kiện thay đổi chế độ toàn màn hình
    useEffect(() => {
        document.addEventListener('fullscreenchange', checkFullScreen);
        return () => {
            document.removeEventListener('fullscreenchange', checkFullScreen);
        };
    }, []);

    // Hàm để vào chế độ toàn màn hình
    const enterFullScreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
    };

    // Hàm để thoát chế độ toàn màn hình
    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    };

    // Hàm toggle: vào hoặc thoát chế độ toàn màn hình
    const toggleFullScreen = () => {
        if (isFullScreen) {
            exitFullScreen();
        } else {
            enterFullScreen();
        }
    };
    console.log(currentPage)
    const handleReadingCurrentPage = async (text) => {
        try {
            loadingButtonRef.current = true;
            setIsLoadingButton(loadingButtonRef.current);
            await handleStopSpeech();

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
        await axios.post('http://localhost:3000/api/speech/stop');
    }
    const handlPauseSpeech = async () => {
        pauseRef.current = true;
        setIsPause(pauseRef.current);
        await axios.post('http://localhost:3000/api/speech/pause');
    }
    const handleResumeSpeech = async () => {
        pauseRef.current = false;
        setIsPause(pauseRef.current);
        await axios.post('http://localhost:3000/api/speech/resume');
    }

    return (
        <div className="ebook-reader">
            <div className="top-bar">
                <button
                    className="nav-button"
                    onClick={() => window.history.back()}
                >
                    <ChevronLeft />
                </button>
                <div className='title-container'>
                    <h1 className="book-title">{bookName}</h1>
                    <p className='chapter-title'>{currentChapterName}</p>
                </div>
                <div className="right-controls">
                    {isReading ?
                        (
                            <>
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
                    />
                    <button
                        className="control-button"
                        onClick={toggleFullScreen}
                    >
                        <Maximize />
                    </button>
                </div>
            </div>

            <div className="content-area">
                {isLoading ?
                    <CircleLoading size={100} />
                    :
                    <SliderPageReader
                        textChunks={textChunks}
                        setCurrentPage={setCurrentPage}
                        readingRef={readingRef}
                        isReading={isReading}
                        setIsReading={setIsReading}
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
        </div>
    );
};

export default ReaderBookPage;