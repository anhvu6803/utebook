import React from 'react';
import './styles/ChapterItem.scss';
import hoaPhuong from "../assets/hoaPhuong.png";
import PurchaseChapter from './PurchaseChapter';
const ChapterItem = ({
    bookName,
    chapterTitle,
    chapterNumber,
    wordCount,
    hoaPhuongAmount = 0
}) => {
    return (
        <>
            <h3 className="chapter-title">
                Chương {chapterNumber}: {chapterTitle}
            </h3>
            <p className="word-count">{wordCount} chữ</p>
            {hoaPhuongAmount > 0 ?
                (
                    <span className="amount-hoaphuong">
                        <p>{(hoaPhuongAmount).toLocaleString('vi-VN')}</p>
                        <img src={hoaPhuong} />
                    </span>
                )
                :
                (
                    <p className="type-text">Miễn phí</p>
                )
            }

            <PurchaseChapter
                hoaPhuongAmount={hoaPhuongAmount}
                chapterName={chapterTitle}
                bookName={bookName}
            />
        </>
    );
};

export default ChapterItem;
