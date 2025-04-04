import React from "react";
import "./styles/BookPage.scss";
import BookSwiper from "../components/BookSwiper";
import RecommendationBook from "../components/RecommendationBook";
const PodcastPage = () => {

  return (
    <div className="book-page-container">
      <RecommendationBook pageName={"podcast"} />
      <div className="book-swiper">
        <p className="book-swiper-title">UTEBOOK đề xuất</p>
        <BookSwiper />
      </div>
    </div>
  );
};

export default PodcastPage;
