// SwiperComponent.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import { useAuth } from "../contexts/AuthContext";
import './styles/BookSwiper.scss'; // Nhập file SCSS
import { Star, BookOpen, Crown, MoveDown, MoveUp, Flower, Award } from 'lucide-react';

import WarningForm from './WarningForm';

import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

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

const showTypeBook = (type) => {
    if (type === 'Free') return { name: 'Miễn phí', icon: <Award /> };
    else if (type === 'Member') return { name: 'Hội viên', icon: <Crown /> }; // 'Hội viên'
    else if (type === 'HoaPhuong') return { name: 'Hoa phượng', icon: <Flower /> } // 'Hoa phượng'
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
                modules={[Navigation, Autoplay]}
                loop={true}
                spaceBetween={50}
                slidesPerView={5}
                ref={swiperRef}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                navigation={false}
            >
                {itemData?.map((item, index) => (
                    <SwiperSlide key={index}
                        onClick={() => handleReadBook(item)}
                        className="slide"
                    >
                        <div className="book-cover">
                            <img src={item.image} alt="Book cover" />
                            <div className={`book-badge ${item.type.toLowerCase()}`}>
                                {showTypeBook(item.type).name.toUpperCase()} {showTypeBook(item.type)?.icon}
                            </div>
                        </div>
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
