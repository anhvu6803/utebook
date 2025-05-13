import React, { useState } from "react";
import "./styles/SorryForm.scss";

import { Modal } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { BookOpen } from "lucide-react";
import sorryGif from "../assets/im-sorry-bow.gif";

const SorryForm = ({ isReading, handleReadingBook, listBookRead }) => {
    const [showForm, setShowForm] = useState(false);
    const handleClick = () => {
        if (isReading) {
            handleReadingBook(listBookRead);
        }
        else {
            setShowForm(true);
        }
    }
    return (
        <>
            <button className="read-btn"
                onClick={() =>
                    handleClick()
                }
            >
                <BookOpen size={20} />
                Đọc từ đầu
            </button>
            <Modal open={showForm}
                onClose={() => setShowForm(false)}
            >
                <div className="sorry-form-container">
                    <div className={`sorry-form ${showForm ? "show" : ""}`}>
                        <h2> Thiếu chương</h2>
                        <p>Truyện đang được cập nhật các chương.</p>
                        <p>Vui lòng quay lại sau!</p>
                        <HighlightOffIcon className="close-icon" onClick={() => setShowForm(false)} />
                        <img src={sorryGif} alt="Sorry" loading="lazy" />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SorryForm;
