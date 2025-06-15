import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./styles/PurchaseChapter.scss";

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Modal } from "@mui/material";
import { Flower } from 'lucide-react';


const PurchaseChapter = ({
    isContinue = false,
    chapterPrice,
    hoaPhuongAmount = 0,
    chapterName,
    bookName,
    readingId,
    chapterId,
    setAlert,
    listChapterOwned,
    bookType,
    handleReadingBook,
    listBookRead
}) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    console.log(listChapterOwned);
    console.log(chapterId);

    const handleReading = async () => {
        if (!isContinue && readingId !== '') {
            try {
                const response = await axios.put(`http://localhost:5000/api/history-readings/${readingId}`,
                    {
                        chapterId: chapterId
                    }
                );
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        else {
            handleReadingBook(listBookRead);
        }
        navigate(`/utebook-reader/${chapterId}`);
    };

    const handlePurchaseChapter = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/points//buy-chapter`,
                {
                    userId: user._id,
                    chapterId: chapterId
                }
            );
            if (response.data.success) {
                if (!listChapterOwned.includes(chapterId)) {
                    handleReadingBook(listBookRead);
                }
                await handleReading();
            }
        } catch (error) {
            setAlert({
                open: true,
                message: "Mua chương thất bại",
                severity: 'error'
            });
            setShowForm(false);
        }
    };
    return (
        <>
            <button className={isContinue ? "read-continue-button" : "read-now-button"}
                onClick={() => {
                    !listChapterOwned.includes(chapterId) && bookType === 'HoaPhuong' ?
                        setShowForm(true) :
                        handleReading();
                }}
                disabled={!user.isMember && bookType === 'Member'}
            >
                {isContinue ? 'ĐỌC TIẾP' : 'ĐỌC NGAY'}
            </button>
            <Modal open={showForm}
                onClose={() => setShowForm(false)}
            >
                <div className="purchase-form-container">
                    <div className={`purchase-form ${showForm ? "show" : ""}`}>
                        <h2>Mua chương</h2>
                        <p>Bạn đang yêu cầu mua chương “ {
                            <span style={{ color: '#005bbb', margin: '0', padding: '0' }}>
                                {chapterName}
                            </span>} ” của truyện “ {
                                <span style={{ color: '#005bbb', margin: '0', padding: '0' }}>
                                    {bookName}
                                </span>} ”
                        </p>
                        <HighlightOffIcon className="close-icon" onClick={() => setShowForm(false)} />
                        <div className="content-line">
                            <p className="name">Giá chương:</p>
                            <span className="amount-hoaphuong">
                                <span className="value">{(chapterPrice).toLocaleString('vi-VN')}</span>
                                <Flower />
                            </span>
                        </div>
                        <div className="content-line">
                            <p className="name">Bạn đang có:</p>
                            <span className="amount-hoaphuong">
                                <span className="value">{(hoaPhuongAmount).toLocaleString('vi-VN')}</span>
                                <Flower />
                            </span>
                        </div>
                        <div className="purchase-form-actions">
                            <button className="cancel-btn" onClick={() => setShowForm(false)}>
                                Hủy bỏ
                            </button>
                            <button className="purchase-btn" onClick={handlePurchaseChapter}>
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default PurchaseChapter;
