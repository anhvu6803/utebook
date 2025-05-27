// SwiperComponent.jsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import './styles/BookSwiper.scss'; // Nhập file SCSS

import 'swiper/css';
import 'swiper/css/navigation';

const BookSwiper = ({ itemData }) => {
    const swiperRef = useRef(null);
    const navigate = useNavigate();
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

    return (
        <div className="swiper-book-container">
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
                        onClick={() => navigate(`/utebook/novel/view/${item._id}`)}
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
