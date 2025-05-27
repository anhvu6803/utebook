import React from 'react';
import './styles/ChapterItem.scss';
import PurchaseChapter from './PurchaseChapter';
import { Flower } from 'lucide-react';
const ChapterItem = ({
    bookName,
    chapterTitle,
    chapterNumber,
    isContinue,
    readingId,
    chapterId,
    chapterPrice,
    hoaPhuongAmount = 0,
    setAlert
}) => {
    console.log(chapterPrice);
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
                {chapterPrice > 0 ?
                    (
                        <>
                            {isContinue ?
                                <p className="owner-text">Đã sở hữu</p>
                                :
                                <span className="amount-hoaphuong">
                                    <p>{(chapterPrice).toLocaleString('vi-VN')}</p>
                                    <Flower />
                                </span>
                            }
                        </>
                    )
                    :
                    (
                        <p className="type-text">Miễn phí</p>
                    )
                }

                <PurchaseChapter
                    chapterPrice={chapterPrice}
                    hoaPhuongAmount={hoaPhuongAmount}
                    chapterName={chapterTitle}
                    bookName={bookName}
                    isContinue={isContinue}
                    readingId={readingId}
                    chapterId={chapterId}
                    setAlert={setAlert}
                />
            </div>

        </>
    );
};

export default ChapterItem;
