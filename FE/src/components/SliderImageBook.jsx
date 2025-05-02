import React, { useRef } from 'react';
import './styles/SliderImageBook.scss'; // Nhập file SCSS
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const SliderImageBook = ({ images, isShow, setIndexBook }) => {
    const swiperRef = useRef(null);
    const imagesTemp = images.map((image) => image);
    const handleNext = () => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slideNext();
        }
    };
    const handlePrev = () => {
        console.log('click');
        if (swiperRef.current) {
            swiperRef.current.swiper.slidePrev();
        }
    };
    return (
        <>
            <Swiper
                modules={[Pagination, Autoplay, EffectCoverflow]}
                effect='coverflow'
                ref={swiperRef}
                slidesPerView={2}
                centeredSlides={true}
                coverflowEffect={{
                    rotate: 0, // Áp dụng hiệu ứng xoay nhẹ
                    stretch: 8, // Không kéo dài slide
                    depth: 200, // Độ sâu của các slide
                    modifier: 2.5, // Điều chỉnh mức độ mạnh của hiệu ứng
                    slideShadows: false,
                }}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                loop={true}
                pagination={{ clickable: true }}
                navigation={false}
                className="mySwiper"
                onSlideChange={() => setIndexBook(swiperRef.current.swiper.realIndex)}
            >
                {imagesTemp.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            src={`${image}?w=248&fit=crop&auto=format`}
                            loading="lazy"
                            className='img-slide'
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className={`swiper-button-container ${isShow}`}>
                <button className="swiper-button-next" onClick={handleNext} />
                <button className="swiper-button-prev" onClick={handlePrev} />
            </div>
        </>
    );
};

export default SliderImageBook;

