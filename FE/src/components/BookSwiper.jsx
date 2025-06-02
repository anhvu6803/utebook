// SwiperComponent.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import { useAuth } from "../contexts/AuthContext";
import './styles/BookSwiper.scss'; // Nhập file SCSS
import WarningForm from './WarningForm';

import 'swiper/css';
import 'swiper/css/navigation';

function isOldEnough(birthDateISO, minAge) {
    const today = new Date();
    const birthDate = new Date(birthDateISO);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= minAge;
}

const BookSwiper = ({ itemData }) => {
    const swiperRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showWarning, setShowWarning] = useState(false);

    // Hàm điều khiển slide tiếp theo
    const handleNext = () => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slideNext();
        }
    };

    // Hàm điều khiển slide trước
    const handlePrev = () => {
        console.log('click');
        if (swiperRef.current) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    const handleReadBook = (bookData) => {
        if (!isOldEnough(user.ngaySinh, bookData.ageLimit)) {
            setShowWarning(true);
            return;
        }
        navigate(`/utebook/novel/view/${bookData._id}`);
    };

    return (
        <div className="swiper-book-container">
            {showWarning && <WarningForm isShow={showWarning} />}
            <Swiper
                modules={[Navigation]}
                spaceBetween={50}
                slidesPerView={5}
                ref={swiperRef}
                loop={true}
                navigation={false}
            >
                {itemData?.map((item, index) => (
                    <SwiperSlide key={index}
                        onClick={() => handleReadBook(item)}
                        className="slide"
                    >
                        <img src={item.image} alt={item.bookname} />
                        <p className="item-title">{item.bookname}</p>
                    </SwiperSlide>

                ))}
            </Swiper>
            <div className="swiper-button-next" onClick={handleNext}></div>
            <div className="swiper-button-prev" onClick={handlePrev}></div>
        </div>
    );
};

export default BookSwiper;
