import React, { useState } from "react";
import "./styles/WarningForm.scss";

import { Modal } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { BookOpen } from "lucide-react";
import warningGif from "../assets/warning.gif";

const typeWaring = (type) => {
    if (type === 'age') {
        return (
            <>
                <p>Bạn chưa đủ tuổi để đọc truyện này!</p>
                <p>Vui lòng cập nhật tuổi và quay lại sau!</p>
            </>
        );
    }
    else {
        return (
            <>
                <p>Bạn phải là hội viên để đọc truyện này!</p>
                <p>Vui lòng đăng ký hội viên và quay lại sau!</p>
            </>
        );
    }
}
const WarningForm = ({ isShow, setShowWarning, type }) => {
    const [showForm, setShowForm] = useState(isShow);
    const handleClick = (value) => {
        if (setShowWarning) {
            setShowWarning(value);
        }
        setShowForm(value);
    }
    return (
        <Modal open={showForm}>
            <div className="warning-form-container">
                <div className={`warning-form ${showForm ? "show" : ""}`}>
                    <h2>Cảnh báo</h2>
                    {typeWaring(type)}
                    <HighlightOffIcon className="close-icon" onClick={() => handleClick(false)} />
                    <img src={warningGif} alt="warning" loading="lazy" />
                </div>
            </div>
        </Modal>
    );
};

export default WarningForm;
