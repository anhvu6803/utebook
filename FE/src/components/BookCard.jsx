import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/BookCard.scss';
import testAvatar from '../assets/testAvatar.jpg';

import { BookOpen } from 'lucide-react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
const BookCard = ({ book, status, pageName }) => {
    const navigate = useNavigate();
    // Default book data if none is provided
    const defaultBook = {
        title: 'Hội chứng không kết hôn',
        author: 'Phương Mẫn Vị',
        rating: 4.470,
        image: testAvatar,
        description: 'Tô Khanh, 32 tuổi, một người phụ nữ mạnh mẽ, xinh đẹp, có quan điểm sống phóng khoáng, kinh tế độc lập, đàn ông theo đuổi không đếm xuể, nhưng ở trong mắt các bà, các mẹ, cô chỉ là một cô gái quá lứa lỡ thì, đã bỏ phí quãng thời gian tươi đẹp...',
        isNew: true
    };

    const bookData = book || defaultBook;

    console.log(book)
    return (
        <div
            className={`card-wrapper ${status}`}
        >
            <div
                className="card-container"
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
                                <span className={`rating-value ${status}`}>5.0</span>
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
                                    onClick={() => handleLikeBook(indexBook)}
                                >
                                    {true ? (
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