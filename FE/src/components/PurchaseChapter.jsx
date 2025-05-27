import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/PurchaseChapter.scss";
import hoaPhuong from "../assets/hoaPhuong.png";

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Modal } from "@mui/material";

const PurchaseChapter = ({
    isContinue = false,
    hoaPhuongAmount = 0,
    chapterName,
    bookName,
    readingId,
    chapterId
}) => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);

    const handleUpdateReading = async () => {
        if (!isContinue) {
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
        navigate(`/utebook-reader/${chapterId}`);
    };

    return (
        <>
            <button className={isContinue ? "read-continue-button" : "read-now-button"}
                onClick={() => {
                    hoaPhuongAmount > 0 ?
                        setShowForm(true) :
                        navigate(`/utebook-reader/${chapterId}`)
                }}
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
                                <span className="value">{(hoaPhuongAmount).toLocaleString('vi-VN')}</span>
                                <img src={hoaPhuong} />
                            </span>
                        </div>
                        <div className="content-line">
                            <p className="name">Bạn đang có:</p>
                            <span className="amount-hoaphuong">
                                <span className="value">{(20000).toLocaleString('vi-VN')}</span>
                                <img src={hoaPhuong} />
                            </span>
                        </div>
                        <div className="purchase-form-actions">
                            <button className="cancel-btn" onClick={() => setShowForm(false)}>
                                Hủy bỏ
                            </button>
                            <button className="purchase-btn" onClick={handleUpdateReading}>
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
