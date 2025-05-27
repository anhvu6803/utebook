import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/BookCard.scss';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

import { BookOpen } from 'lucide-react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
const BookCard = ({
    book,
    status,
    pageName,
    height = 320,
    handleLikeBook
}) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const bookData = book;
    const [listUserFavoriteBook, setListUserFavoriteBook] = useState(bookData.listUserFavorited);

    return (
        <div
            className={`card-wrapper ${status}`}
        >
            <div
                className="card-container"
                style={{
                    height: height,
                }}
            >
                <div className={`card-image ${status}`}>
                    <img
                        srcSet={`${bookData.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`${bookData.image}?w=248&fit=crop&auto=format`}
                        loading="lazy"
                        style={{
                            width: 180,
                            height: 280,
                            borderRadius: 15,
                            objectFit: 'cover',
                        }}
                    />
                </div>

                <div className={`card-details ${status}`}>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <h1 className={`card-title ${status}`}>{bookData.bookname}</h1>
                        <h2 className={`card-author ${status}`}>{bookData.author}</h2>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: '20px',
                            }}
                        >
                            <div className={`book-rating ${status}`}>
                                <span className={`rating-value ${status}`}>{bookData.avegradeRate}</span>
                                <span className="rating-star">★</span>
                            </div>
                            <div className="card-actions ">
                                <button
                                    className={`btn-read ${status}`}
                                    onClick={() => navigate(`/utebook/${pageName}/view/${bookData._id}`)}
                                >
                                    <BookOpen />
                                    Đọc ngay
                                </button>
                                <button
                                    className="btn-favorite"
                                    onClick={() => handleLikeBook(
                                        listUserFavoriteBook.includes(user._id),
                                        listUserFavoriteBook,
                                        setListUserFavoriteBook,
                                        bookData
                                    )}
                                >
                                    {listUserFavoriteBook.includes(user._id) ? (
                                        <FavoriteIcon />
                                    ) : (
                                        <FavoriteBorderIcon />
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>

                    <p className={`card-description ${status}`}>
                        {bookData?.description || "Hiện đang cập nhật mô tả"}
                    </p>

                </div>
            </div>
        </div>
    );
};

export default BookCard;