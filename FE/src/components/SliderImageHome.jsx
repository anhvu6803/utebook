import React, { useRef } from 'react';
import './styles/SliderImageHome.scss'; // Nhập file SCSS
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import các style riêng biệt cho Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const SliderImageHome = () => {
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
    <div className='slider-image-home'>
      <div className="swiper-container">
        <Swiper
          modules={[Pagination, Autoplay]}
          ref={swiperRef}
          loop={true}
          pagination={{ clickable: true }}
          navigation={false}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          className="swiper-wrapper"
        >
          <div className='swiper-button'>
            <button className="swiper-button-next" onClick={handleNext} />
            <button className="swiper-button-prev" onClick={handlePrev} />
          </div>
          <SwiperSlide>
            <img src='https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/4009.jpg?v=1&w=1920&h=600' className='img-home' />
          </SwiperSlide>
          <SwiperSlide>
            <img src='https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/4009.jpg?v=1&w=1920&h=600' className='img-home' />
          </SwiperSlide>
          <SwiperSlide>
            <img src='https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/4009.jpg?v=1&w=1920&h=600' className='img-home' />
          </SwiperSlide>
        </Swiper>

      </div>
    </div>
  );
};

export default SliderImageHome;

