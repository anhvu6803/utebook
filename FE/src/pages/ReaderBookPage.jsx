// App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ReaderBookPage.scss';
import { ChevronLeft, Headphones, Maximize } from 'lucide-react';
import CustomSlider from '../components/CustomSlider';
import SliderPageReader from '../components/SliderPageReader';
// Import text content
//import chapterText from '../assets/chapterText.txt';
const ReaderBookPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(30);

    const [textChunks, setTextChunks] = useState([]);
    const linesPerSlide = 5; // Number of lines per slide

    useEffect(() => {
        const fetchTextFromDrive = async () => {
            try {
                // Gửi yêu cầu POST để lấy văn bản từ Google Drive
                const response = await axios.post(
                    'http://localhost:3000/api/get_drive',
                    { drive_link: "https://drive.google.com/file/d/10yiPZrx58Rn8BFD1aTSldGdXFzRzVrdL/view?usp=sharing" }
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

            } catch (error) {
                console.error('Error fetching or processing the text:', error);
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

    return (
        <div className="ebook-reader">
            <div className="top-bar">
                <button className="nav-button">
                    <ChevronLeft />
                </button>
                <div className='title-container'>
                    <h1 className="book-title">Bảo bối của ngài Tổng</h1>
                    <p className='chapter-title'>Chương 24: Ngài Tổng nhìn xa trông rộng</p>
                </div>
                <div className="right-controls">
                    <button className="control-button">
                        <Headphones />
                    </button>
                    <button
                        className="control-button"
                        onClick={toggleFullScreen}
                    >
                        <Maximize />
                    </button>
                </div>
            </div>

            <div className="content-area">
                <SliderPageReader
                    textChunks={textChunks}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            <div className="bottom-bar">
                <div className='bottom-bar-text'>
                    <div className="chapter-info">Chương 24: Ngài Tổng nhìn xa trông rộng</div>
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