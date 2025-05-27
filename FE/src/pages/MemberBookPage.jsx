import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

import "./styles/MemberBookPage.scss";
import background from "../assets/book-background.jpg";
import axios from "../utils/axios";
import CustomSelect_Category from "../components/CustomSelect_Category";
import CustomImageList from "../components/CustomImageList";
import PaginationButtons from "../components/PaginationButtons";
import CustomAlert from '../components/CustomAlert';
import { ChevronRight } from "lucide-react";

const splitIntoGroups = (inputList, chunkSize) => {
  const result = [];
  for (let i = 0; i < inputList.length; i += chunkSize) {
    result.push(inputList.slice(i, i + chunkSize));
  }
  console.log(inputList);
  return result;
}

const MemberBookPage = () => {
  const { category } = useParams();
  const { user } = useAuth();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const page = parseInt(searchParams?.get('page') || 1, 10);

  const [listBooks, setListBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Chọn thể loại");
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

  useEffect(() => {
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
    getUser();
  }, [])

  useEffect(() => {
    if (category === '') {
      const getAllBooksbyType = async () => {
        try {
          setIsLoading(true);
          const res = await axios.get(
            `http://localhost:5000/api/book/books/type/member`,
          );
          setAllBooks(res.data.data);
        } catch (err) {
          setIsLoading(false);
        }
        finally {
          setIsLoading(false);
        }
      }
      getAllBooksbyType();
    }
    else {
      getListBooksByCategory(category);
    }
  }, [])

  const handleCategoryChange = (value) => {
    navigate(`/utebook/sach-hoi-vien/${value}`);
    window.location.reload();
    setSelectedCategory(value);
    getListBooksByCategory(value);
  };

  const getListBooksByCategory = async (category) => {
    try {
      setIsLoading(true);
      setSelectedCategory(category);
      const res = await axios.get(
        `http://localhost:5000/api/book/type-books/categories-type`,
        {
          params: {
            category: category,
            type: 'member'
          }
        },
      );
      setAllBooks(res.data.data);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
    finally {
      setIsLoading(false);
    }
  }
  const handleLikeBook = async (value, listUserFavoriteBook, setListUserFavoriteBook, bookData) => {
    const temp = !value;
    try {

      let updatedFavoriteBook;
      let updatedUserFavoriteBook;
      if (temp) {
        // Nếu đang muốn thêm sách vào danh sách yêu thích
        updatedFavoriteBook = listFavoriteBook.includes(bookData._id)
          ? listFavoriteBook
          : [...listFavoriteBook, bookData._id];

        updatedUserFavoriteBook = listUserFavoriteBook.includes(user._id)
          ? listUserFavoriteBook
          : [...listUserFavoriteBook, user._id];

      } else {
        updatedFavoriteBook = listFavoriteBook.filter((id) => id !== bookData._id);
        updatedUserFavoriteBook = listUserFavoriteBook.filter((id) => id !== user._id);
      }

      const responseUser = await axios.patch(`http://localhost:5000/api/user/${user._id}`, {
        listFavoriteBook: updatedFavoriteBook
      })

      if (responseUser.data.success) {
        setListFavoriteBook(updatedFavoriteBook);
        const responseBook = await axios.put(`http://localhost:5000/api/book/books/${bookData._id}`, {
          listUserFavorited: updatedUserFavoriteBook
        });
        if (responseBook.data.success) {
          setListUserFavoriteBook(updatedUserFavoriteBook);
          const updatedPage = allBooks.map((item) =>
            item._id === responseBook.data.data._id ? responseBook.data.data : item
          );
          setAllBooks(updatedPage);
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
  const handlePageChange = (event, value) => {
    const currentPath = location.pathname;
    navigate(`${currentPath}?page=${value}`);
  };
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };
  return (
    <>
      <img src={background} alt="background" className="img-backgound" />

      <div className="memberbook-container">
        <div className="memberbook-header">
          <div style={
            {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 150,
              gap: 20
            }
          }>
            {category ?
              <h2
                style={{
                  cursor: 'pointer',
                  fontSize: 20,
                  marginTop: 10
                }}
                onClick={() => {
                  navigate('/utebook/newest');
                  window.location.reload();
                }}
              >
                Sách hội viên <ChevronRight size={20} />
              </h2>
              :
              <h2>
                Sách hội viên
              </h2>
            }
            <CustomSelect_Category
              options={categories}
              selectedValue={selectedCategory}
              handleChange={handleCategoryChange}
              style={{ width: 205, height: 50, }}
              size={'large'}
            />
          </div>

          <p className="subtitle">Nghe và đọc hàng ngàn nội dung thuộc Kho sách Hội viên</p>
        </div>
        {!isLoading &&
          <div className="book-page">
            {allBooks.length > 0 &&
              <>
                <CustomImageList
                  itemData={splitIntoGroups(allBooks, 30)}
                  page={page}
                  pageName="sach-hoi-vien"
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
      </div >
      <CustomAlert alert={alert} handleCloseAlert={handleCloseAlert} />
    </>
  );
};

export default MemberBookPage;

const categories = [
  { label: 'Đô thị', value: 'Đô thị' },
  { label: 'Tiên hiệp', value: 'Tiên hiệp' },
  { label: 'Trinh thám', value: 'Trinh thám' },
  { label: 'Ngôn tình', value: 'Ngôn tình' },
  { label: 'Linh dị', value: 'Linh dị' },
  { label: 'Truyện Ma', value: 'Truyện Ma' },
];
