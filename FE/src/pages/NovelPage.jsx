import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./styles/BookCategoryPage.scss";
import { useAuth } from "../contexts/AuthContext";

import RecommendationBook from "../components/RecommendationBook";
import CustomImageList from "../components/CustomImageList";
import PaginationButtons from "../components/PaginationButtons";
import Loading from '../components/Loading';
import CustomAlert from '../components/CustomAlert';
const splitIntoGroups = (inputList, chunkSize) => {
  const result = [];
  for (let i = 0; i < inputList.length; i += chunkSize) {
    result.push(inputList.slice(i, i + chunkSize));
  }
  return result;
}
const NovelPage = () => {
  const { category } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const page = parseInt(searchParams?.get('page') || 1, 10);

  const [listBooks, setListBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listFavoriteBook, setListFavoriteBook] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const getUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${user._id}`);
      if (response.data.success) {
        setListFavoriteBook(response.data.data.listFavoriteBook);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  const getAllBooksRecommend = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:8000/recommendations/${user._id}?n_recommendations=30`,
      );
      console.log(res.data);
      setAllBooks(res.data);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
    finally {
      setIsLoading(false);
    }
  }
  const getListBooks = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/book/random-books/`,
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        getUser();
        getListBooks();
        getAllBooksRecommend();
      } catch (err) {
        console.log(err);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    fetchData();
  }, []);

  const handlePageChange = (event, value) => {
    const currentPath = location.pathname;
    navigate(`${currentPath}?page=${value}`);
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleLikeBook = async (value, listUserFavoriteBook, setListUserFavoriteBook, bookData) => {
    const temp = !value;
    try {

      let updatedFavoriteBook;
      let updatedUserFavoriteBook;
      if (temp) {
        // Nếu đang muốn thêm sách vào danh sách yêu thích
        updatedFavoriteBook = listFavoriteBook.includes(bookData.book_id)
          ? listFavoriteBook
          : [...listFavoriteBook, bookData.book_id];

        updatedUserFavoriteBook = listUserFavoriteBook.includes(user._id)
          ? listUserFavoriteBook
          : [...listUserFavoriteBook, user._id];

      } else {
        updatedFavoriteBook = listFavoriteBook.filter((id) => id !== bookData.book_id);
        updatedUserFavoriteBook = listUserFavoriteBook.filter((id) => id !== user._id);
      }

      const responseUser = await axios.patch(`http://localhost:5000/api/user/${user._id}`, {
        listFavoriteBook: updatedFavoriteBook
      })

      if (responseUser.data.success) {
        setListFavoriteBook(updatedFavoriteBook);
        console.log(updatedFavoriteBook);
        const responseBook = await axios.put(`http://localhost:5000/api/book/books/${bookData.book_id}`, {
          listUserFavorited: updatedUserFavoriteBook
        });
        if (responseBook.data.success) {
          setListUserFavoriteBook(updatedUserFavoriteBook);
          const updatedPage = allBooks.map((item) =>
            item.book_id === responseBook.data.data._id ? responseBook.data.data : item
          );
          setAllBooks(updatedPage);
          console.log(responseBook.data.data);
          if (temp) {
            setAlert({
              open: true,
              message: 'Thêm sách vào danh sách yêu thích thành công',
              severity: 'success'
            });
          }
          else {
            setAlert({
              open: true,
              message: 'Xóa khỏi danh sách yêu thích thành công',
              severity: 'success'
            });
          }
        }
      }
    } catch (err) {
      setAlert({
        open: true,
        message: 'Có lỗi khi thêm sách vào phần yêu thích',
        severity: 'error'
      });
      console.error(err);
    }
  }
  if (isLoading) return <Loading />

  return (
    <div className="book-category-container">
      <RecommendationBook
        pageName={"novel"}
        listBooks={listBooks}
      />
      {!isLoading &&
        <div className="book-page">
          <p className="book-page-title">UTEBOOK đề xuất</p>
          {allBooks.length > 0 &&
            <>
              <CustomImageList
                itemData={splitIntoGroups(allBooks, 30)}
                page={page}
                pageName={"novel"}
                handleLikeBook={handleLikeBook}
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
      <CustomAlert alert={alert} handleCloseAlert={handleCloseAlert} />
    </div>
  );
};

export default NovelPage;
