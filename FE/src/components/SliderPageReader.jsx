import React, { useState, useRef } from 'react';
import axios from 'axios';
import './styles/SliderPageReader.scss';
import { Spin } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import các style riêng biệt cho Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SliderTextReader = ({
  textChunks,
  setCurrentPage,
  isReading,
  readingRef,
  setIsReading }) => {
  const swiperRef = useRef(null);
  const loadingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(loadingRef.current);
  const [currentIndex, setCurrentIndex] = useState(0);
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
      setCurrentPage(swiperRef.current.swiper.realIndex + 1);
    }
  };


  const handleSpeechText = async (text, index) => {
    if (isReading) return;
      try {
        loadingRef.current = true;
        setIsLoading(loadingRef.current);
        await handleStopSpeech(index);

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
        console.log(response);
      }
      catch (error) {
        console.error('Error fetching speech:', error);
      }
      finally {
        loadingRef.current = false;
        setIsLoading(loadingRef.current);
        readingRef.current = true;
        setIsReading(readingRef.current);
      }
  }
  const handleStopSpeech = async (index) => {
    if (currentIndex !== index || readingRef.current) {
      setCurrentIndex(index);
      readingRef.current = false;
      await axios.post('http://localhost:3000/api/speech/stop');
    }
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
                  <>
                    {currentIndex === lineIndex && isLoading ?
                      <Spin spinning={isLoading}>
                        <p
                          onClick={() =>
                            handleSpeechText(line, lineIndex)
                          }
                          key={lineIndex}
                          className={isChapterHeading(line) ? 'chapter-heading' : ''}
                        >
                          {line}
                        </p>
                      </Spin>
                      :
                      (
                        <p
                          onClick={() =>
                            handleSpeechText(line, lineIndex)
                          }
                          key={lineIndex}
                          className={isChapterHeading(line) ? 'chapter-heading' : ''}
                        >
                          {line}
                        </p>
                      )
                    }
                  </>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div >
  );
};

export default SliderTextReader;