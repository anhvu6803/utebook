import React, { useRef } from 'react';
import './styles/SliderImageHome.scss'; // Nhập file SCSS
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import các style riêng biệt cho Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

import hcmute_pic1 from '../assets/hcmute_pic1.png';
import hcmute_pic2 from '../assets/hcmute_pic2.png';
import hcmute_pic3 from '../assets/hcmute_pic3.png';
import hcmute_pic4 from '../assets/hcmute_pic4.png';

const imageList = [
  hcmute_pic1,
  hcmute_pic2,
  hcmute_pic3,
  hcmute_pic4,
]

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
          {imageList.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} className='img-home' />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SliderImageHome;

