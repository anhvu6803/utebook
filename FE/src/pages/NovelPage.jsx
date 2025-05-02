import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/BookPage.scss";
import BookSwiper from "../components/BookSwiper";
import RecommendationBook from "../components/RecommendationBook";

const NovelPage = () => {
  const [listNovels, setListNovels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getListNovels = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/api/book/random-books");
        setListNovels(res.data.data);
      } catch (err) {
        console.log(err);
      }
      finally {
        setIsLoading(false);
      }
    }
    getListNovels();
  }, [])

  return (
    <div className="book-page-container">
      <RecommendationBook
        pageName={"novel"}
        listBooks={listNovels}
      />
      <div className="book-swiper">
        <p className="book-swiper-title">UTEBOOK đề xuất</p>
        <BookSwiper />
      </div>
    </div>
  );
};

export default NovelPage;
