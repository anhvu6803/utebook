import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./styles/BookCategoryPage.scss";

import RecommendationBook from "../components/RecommendationBook";
import CustomImageList from "../components/CustomImageList";
import PaginationButtons from "../components/PaginationButtons";

const splitIntoGroups = (inputList, chunkSize) => {
  const result = [];
  for (let i = 0; i < inputList.length; i += chunkSize) {
    result.push(inputList.slice(i, i + chunkSize));
  }
  return result;
}

const BookCategoryPage = ({ pageName }) => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const page = parseInt(searchParams?.get('page') || 1, 10);

  const [listBooks, setListBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //Random books
  useEffect(() => {
    const getListNovelsCategory = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/book/random-books/${category}`,
        );
        setListBooks(res.data.data);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
      finally {
        setIsLoading(false);
      }
    }
    getListNovelsCategory();
  }, [])

  //All books
  useEffect(() => {
    const getAllBooksbyCategory = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/book/books/categories/${category}`,
        );
        console.log(res.data.data);
        setAllBooks(res.data.data);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
      finally {
        setIsLoading(false);
      }
    }
    getAllBooksbyCategory();
  }, [])

  const handlePageChange = (event, value) => {
    const currentPath = location.pathname;
    navigate(`${currentPath}?page=${value}`);
  };

  return (
    <div className="book-category-container">
      <RecommendationBook
        pageName={pageName}
        category={category}
        listBooks={listBooks}
      />
      {!isLoading &&
        <div className="book-page">
          <p className="book-page-title">{category}</p>
          {allBooks.length > 0 &&
            <>
              <CustomImageList
                itemData={splitIntoGroups(allBooks, 30)}
                page={page}
                pageName={pageName}
              />
              <PaginationButtons
                count={Math.ceil(allBooks.length / 30)}
                page={page}
                handlePageChange={handlePageChange}
              />
            </>
          }
        </div>
      }
    </div>
  );
};

export default BookCategoryPage;

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: '[Tóm tắt sách] Bản đồ của trái tim tim tim tim',
    author: '@bkristastucchio',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    author: '@nolanissac',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    author: '@hjrc33',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
    author: '@tjdragotta',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
    author: '@katie_wasserman',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    author: '@silverdalex',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
    author: '@shelleypauls',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
    author: '@peterlaster',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    author: '@southside_customs',
  },

];