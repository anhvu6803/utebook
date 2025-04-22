import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './styles/SliderPageReader.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import các style riêng biệt cho Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SliderTextReader = ({ textChunks, setCurrentPage }) => {
  const swiperRef = useRef(null);
  const isChapterHeading = (line) => {
    return line.trim().startsWith('Chương');
  };
  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
      setCurrentPage(swiperRef.current.swiper.realIndex + 1);
    }
  };

  // Hàm điều khiển slide trước
  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
      setCurrentPage(swiperRef.current.swiper.realIndex - 1);
    }
  };

  const handleSpeechText = async (text) => {
    const response = await fetch('http://localhost:3000/api/speech_line', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        delay: 0.2
      })
    });
  }

  return (
    <div className='slider-page-reader'>
      <div className="swiper-container">
        <Swiper
          ref={swiperRef}
          navigation={false}
          pagination={{ type: 'fraction' }}
          modules={[Navigation, Pagination]}
          className="swiper-wrapper"
        >
          <div className='swiper-button'>
            <button
              className="swiper-button-prev"
              onClick={handlePrev}
              disabled={swiperRef.current && swiperRef.current.swiper.isBeginning}
            />
            <button
              className="swiper-button-next"
              onClick={handleNext}
              disabled={swiperRef.current && swiperRef.current.swiper.isEnd}
            />
          </div>

          {textChunks.map((chunk, index) => (
            <SwiperSlide key={index}>
              <div className="text-content">
                {chunk.map((line, lineIndex) => (
                  <p
                    onClick={() => handleSpeechText(line)}
                    key={lineIndex}
                    className={isChapterHeading(line) ? 'chapter-heading' : ''}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SliderTextReader;