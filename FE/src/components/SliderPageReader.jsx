import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './styles/SliderPageReader.scss';
import { Spin } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import các style riêng biệt cho Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function highlightText(chunk, keyword, fontSize, fontFamily, isChapterHeading) {
  const allLines = keyword
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  // Gộp toàn bộ chunk thành một chuỗi duy nhất, giữ lại xuống dòng
  let fullText = chunk.join('\n');

  // Thay thế các keyword bằng highlight
  allLines.forEach(word => {
    if (word) {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex special chars
      const regex = new RegExp(escapedWord, 'g');
      fullText = fullText.replace(regex, `<mark>${word}</mark>`);
    }
  });

  // Tách lại chuỗi thành từng dòng (sử dụng dangerouslySetInnerHTML vì có HTML)
  const highlightedLines = fullText.split('\n');

  return (
    <>
      {highlightedLines.map((line, index) => (
        <p
          key={index}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            margin: '0 0 10px',
            lineHeight: 1.6,
            fontWeight: isChapterHeading(chunk[index]) ? 'bold' : '400',
            cursor: 'text',
          }}
          dangerouslySetInnerHTML={{ __html: line }}
        />
      ))}
    </>
  );
}

function highlightTextReading(chunk, lineIndex, fontSize, fontFamily, isChapterHeading) {
  return (
    <>
      {chunk.map((line, index) => (
        <p
          key={index} S
          style={{
            backgroundColor: index === lineIndex - 1 ? '#7FADDD' : 'transparent',
            color: index === lineIndex - 1 && 'white',

            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            fontWeight: isChapterHeading(line) ? 'bold' : '400',
            margin: '0 0 10px',
            lineHeight: 1.6,
            padding: '4px',
            borderRadius: '4px',
          }}
          dangerouslySetInnerHTML={{ __html: line }}
        />
      ))}

    </>
  );
}

const SliderTextReader = ({
  textChunks,
  setCurrentPage,
  isReading,
  readingRef,
  setIsReading,
  flowReadingRef,
  lineIndex,
  fontSize,
  fontFamily,
  handleReadingCurrentPage
}) => {
  const swiperRef = useRef(null);
  const loadingRef = useRef(false);
  const lineRefs = useRef([]);

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

  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection().toString();
      if (selection.length > 0) {
        setSelectedText(selection);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  console.log(textChunks);

  useEffect(() => {
    const slideChange = async () => {
      console.log(flowReadingRef.current);
      if (lineIndex === null && flowReadingRef.current === true) {
        handleNext();
        await handleReadingCurrentPage(textChunks[swiperRef.current.swiper.realIndex]);
      }

    }
    slideChange();

  }, [lineIndex]);


  return (
    <div className='slider-page-reader'>
      <div className="swiper-container">
        <Swiper
          ref={swiperRef}
          navigation={false}
          pagination={{ type: 'fraction' }}
          allowTouchMove={false}
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
              <div className="text-content"
                style={{
                  overflow: textChunks.length === 1 ? 'auto' : 'hidden',
                  justifyContent: textChunks.length === 1 ? 'flex-start' : 'center',
                }}
              >
                {isReading ?
                  highlightTextReading(chunk, lineIndex, fontSize, fontFamily, isChapterHeading)
                  :
                  highlightText(chunk, selectedText, fontSize, fontFamily, isChapterHeading)
                }

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div >
  );
};

export default SliderTextReader;