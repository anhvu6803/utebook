// SwiperComponent.jsx
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import './styles/BookSwiper.scss'; // Nhập file SCSS
import background2 from "../assets/background2.jpg";

import 'swiper/css';
import 'swiper/css/navigation';

const BookSwiper = () => {
    const swiperRef = useRef(null);

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
                <SwiperSlide>
                    <img src={background2} alt="book 1" />
                    <p>Mùi nằm tuổi Hai Muời</p>
                </SwiperSlide>
                <SwiperSlide>
                    <img src={background2} alt="book 2" />
                    <p>Yêu sao cho đúng, sống sao cho trọn</p>
                </SwiperSlide>
                <SwiperSlide>
                    <img src={background2} alt="book 3" />
                    <p>Muốn kiếp nhân sinh 2</p>
                </SwiperSlide>
                <SwiperSlide>
                    <img src={background2} alt="book 4" />
                    <p>AI lang nghe tôi trai long</p>
                </SwiperSlide>
                <SwiperSlide>
                    <img src={background2} alt="book 5" />
                    <p>Top 5 kỹ năng mềm</p>
                </SwiperSlide>
                <SwiperSlide>
                    <img src={background2} alt="book 5" />
                    <p>Top 5 kỹ năng mềm</p>
                </SwiperSlide>
                <SwiperSlide>
                    <img src={background2} alt="book 5" />
                    <p>Top 5 kỹ năng mềm</p>
                </SwiperSlide>
                <SwiperSlide>
                    <img src={background2} alt="book 5" />
                    <p>Top 5 kỹ năng mềm</p>
                </SwiperSlide>
            </Swiper>
            <div className="swiper-button-next" onClick={handleNext}></div>
            <div className="swiper-button-prev" onClick={handlePrev}></div>
        </div>
    );
};

export default BookSwiper;
