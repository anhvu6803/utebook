import { useState } from 'react';
import './styles/RatingForm.scss';
import axios from "axios";

import { HiStar } from "react-icons/hi";
import { Modal } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const RatingForm = ({
    setAlert,
    idUser,
    idBook,
    setIsReviewLoading,
    setListReviews,
}) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleStarHover = (index) => {
        setHoveredRating(index);
    };

    const handleStarClick = (index) => {
        setRating(index);
    };

    const handleSubmit = async () => {
        try {
            setIsReviewLoading(true);
            const response = await axios.post('http://localhost:5000/api/review/add',
                {
                    userId: idUser,
                    bookId: idBook,
                    rating: rating,
                    comment: feedback || ' '
                }
            );
            if (response.status === 201) {
                setAlert({
                    open: true,
                    message: `Đã gửi nhận xét thành công`,
                    severity: 'success'
                });
                console.log(response.data.review);
                setListReviews((prevReviews) => [...prevReviews, response.data.review]);
            }
        }
        catch (error) {
            setAlert({
                open: true,
                message: `Đã gửi nhận xét thất bại`,
                severity: 'error'
            });
        }
        finally {
            setShowForm(false);
            setTimeout(() => {
                setIsReviewLoading(false);
            }, 500);
        }

    };

    return (
        <>
            <button
                className="write-review-btn"
                onClick={() => setShowForm(true)}
            >
                <span>Viết đánh giá</span>
            </button>
            <Modal open={showForm}
                onClose={() => setShowForm(false)}
            >

                <div className="rating-form-container">
                    <div className={`rating-form ${showForm ? "show" : ""}`}>
                        <HighlightOffIcon className="close-icon" onClick={() => setShowForm(false)} />
                        <h2>Đánh giá và nhận xét</h2>

                        <div className="rating-section">
                            <span className='title-rating'>Đánh giá</span>
                            <div className="stars-container">
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <span
                                        key={index}
                                        className={`star ${index <= (hoveredRating || rating) ? 'active' : ''}`}
                                        onMouseEnter={() => handleStarHover(index)}
                                        onMouseLeave={() => handleStarHover(0)}
                                        onClick={() => handleStarClick(index)}
                                    >
                                        <HiStar size={24} />
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="feedback-section">
                            <span className='title-feedback'>Nhận xét</span>
                            <div className='textarea-container'>
                                <textarea
                                    placeholder="Hãy cho chúng mình một vài nhận xét và đóng góp ý kiến nhé"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    maxLength={300}
                                />
                            </div>
                            <div className="character-count">{feedback.length}/300</div>
                        </div>

                        <button
                            className="submit-button"
                            onClick={handleSubmit}
                            disabled={rating === 0}
                        >
                            Gửi nhận xét
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RatingForm;