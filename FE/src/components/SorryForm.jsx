import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/SorryForm.scss";

import { Modal } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { BookOpen } from "lucide-react";
import sorryGif from "../assets/im-sorry-bow.gif";
import PurchaseForm from "./PurchaseForm";

const SorryForm = ({
    isReading,
    isDisabled,
    bookName,
    chapterTitle,
    isContinue,
    readingId,
    chapterId,
    chapterPrice,
    hoaPhuongAmount = 0,
    setAlert,
    listChapterOwned,
    bookType,
    handleReadingBook,
    listBookRead
}) => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [purchaseChapter, setPurchaseChapter] = useState(false);
    const handleClick = () => {
        if (isReading) {
            console.log(listChapterOwned.includes(chapterId));
            if (listChapterOwned.includes(chapterId) && bookType === 'HoaPhuong'
                || bookType === 'Free' || bookType === 'Member'
            ) {
                setPurchaseChapter(false);
                navigate(`/utebook-reader/${chapterId}`);
            }
            else {
                setPurchaseChapter(true);
            }
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
                disabled={isDisabled}
            >
                <BookOpen size={20} />
                Đọc từ đầu
            </button>

            {purchaseChapter &&
                <PurchaseForm
                    showForm={purchaseChapter}
                    setShowForm={setPurchaseChapter}
                    chapterPrice={chapterPrice}
                    hoaPhuongAmount={hoaPhuongAmount}
                    chapterName={chapterTitle}
                    bookName={bookName}
                    isContinue={isContinue}
                    readingId={readingId}
                    chapterId={chapterId}
                    setAlert={setAlert}
                    listChapterOwned={listChapterOwned}
                    bookType={bookType}
                    handleReadingBook={handleReadingBook}
                    listBookRead={listBookRead}
                />
            }

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
