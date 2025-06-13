import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./styles/PurchaseChapter.scss";
import hoaPhuong from "../assets/hoaPhuong.png";

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Modal } from "@mui/material";
import { Spin } from "antd";
import { Flower } from 'lucide-react';

const PurchaseChapterForm = ({
    hoaPhuongAmount = 0,
    bookName,
    readingId,
    setAlert,
    listChapterOwned,
    setListChapterOwned,
    chapter,
    currentChapter,
    handleLoadChapter,
    isLoadChapter = true
}) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);

    const handleUpdateReading = async () => {
        if (!listChapterOwned.includes(chapter._id)) {
            try {
                const response = await axios.put(`http://localhost:5000/api/history-readings/${readingId}`,
                    {
                        chapterId: chapter._id
                    }
                );
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        handleLoadChapter(chapter._id);
    };

    const handlePurchaseChapter = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/points//buy-chapter`,
                {
                    userId: user._id,
                    chapterId: chapter._id
                }
            );
            if (response.data.success) {
                if (isLoadChapter) {
                    await handleUpdateReading();
                }
                setListChapterOwned([...listChapterOwned, chapter._id]);
                setAlert({
                    open: true,
                    message: "Mua chương thành công",
                    severity: 'success'
                });
                setShowForm(false);
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
            <div
                key={chapter._id}
                className={`chapter-list__item ${chapter._id === currentChapter ? 'chapter-list__item--active' : ''}`}
                onClick={() => {
                    !listChapterOwned.includes(chapter._id) ?
                        setShowForm(true) :
                        handleUpdateReading();
                }}
            >
                <div className="chapter-list__item-title">
                    {chapter.chapterName}
                </div>
                {listChapterOwned.includes(chapter._id) ?
                    (
                        <div className={`chapter-list__item-status free`}>
                            <p>Đã sở hữu</p>
                        </div>
                    )
                    :
                    (
                        <>
                            <div className={`chapter-list__item-status ${chapter.price === 0 ? 'free' : 'paid'}`}>
                                <p>{chapter.price}</p> <Flower />

                            </div>
                        </>
                    )
                }
            </div >
            <Modal open={showForm}
                onClose={() => setShowForm(false)}
            >
                <div className="purchase-form-container">
                    <div className={`purchase-form ${showForm ? "show" : ""}`}>
                        <h2>Mua chương</h2>
                        <p>Bạn đang yêu cầu mua chương “ {
                            <span style={{ color: '#005bbb', margin: '0', padding: '0' }}>
                                {chapter.chapterName}
                            </span>} ” của truyện “ {
                                <span style={{ color: '#005bbb', margin: '0', padding: '0' }}>
                                    {bookName}
                                </span>} ”
                        </p>
                        <HighlightOffIcon className="close-icon" onClick={() => setShowForm(false)} />
                        <div className="content-line">
                            <p className="name">Giá chương:</p>
                            <span className="amount-hoaphuong">
                                <span className="value">{(chapter.price).toLocaleString('vi-VN')}</span>
                                <img src={hoaPhuong} />
                            </span>
                        </div>
                        <div className="content-line">
                            <p className="name">Bạn đang có:</p>
                            <span className="amount-hoaphuong">
                                <span className="value">{(hoaPhuongAmount).toLocaleString('vi-VN')}</span>
                                <img src={hoaPhuong} />
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

export default PurchaseChapterForm;
