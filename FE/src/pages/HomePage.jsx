import React from "react";
import "./styles/HomePage.scss";
import SliderImageHome from "../components/SliderImageHome";
import BookSwiper from "../components/BookSwiper";
const HomePage = () => {

  return (
    <div className="home-container">
      <div className="image-swiper">
        <SliderImageHome />
      </div>
      <div className="book-swiper">
        <p className="book-swiper-title">UTEBOOK đề xuất</p>
        <BookSwiper />
      </div>
      <div className="book-swiper">
        <p className="book-swiper-title">UTEBOOK đề xuất</p>
        <BookSwiper />
      </div>
      <div className="book-swiper">
        <p className="book-swiper-title">UTEBOOK đề xuất</p>
        <BookSwiper />
      </div>
    </div>
  );
};

export default HomePage;
