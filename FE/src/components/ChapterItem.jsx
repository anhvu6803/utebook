import React from 'react';
import './styles/ChapterItem.scss';
import PurchaseChapter from './PurchaseChapter';
import { Flower } from 'lucide-react';
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
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: '20px'
                }}
            >
                {hoaPhuongAmount > 0 ?
                    (
                        <span className="amount-hoaphuong">
                            <p>{(hoaPhuongAmount).toLocaleString('vi-VN')}</p>
                            <Flower />
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
            </div>

        </>
    );
};

export default ChapterItem;
