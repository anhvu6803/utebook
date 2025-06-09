import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/SearchPage.scss';
import { useAuth } from "../contexts/AuthContext";

import CustomImageList from "../components/CustomImageList";
import Loading from '../components/Loading';
import CustomAlert from '../components/CustomAlert';
import { Search } from "lucide-react";
import { Spin } from 'antd';
import CircleLoading from "../components/CircleLoading";
import { set } from "mongoose";
const splitIntoGroups = (inputList, chunkSize) => {
    const result = [];
    for (let i = 0; i < inputList.length; i += chunkSize) {
        result.push(inputList.slice(i, i + chunkSize));
    }
    return result;
}

const categories = [
    { label: 'Đô thị', value: 'dothi' },
    { label: 'Tiên hiệp', value: 'tienhiep' },
    { label: 'Trinh thám', value: 'trinhtham' },
    { label: 'Ngôn tình', value: 'ngontinh' },
    { label: 'Linh dị', value: 'linhdi' },
    { label: 'Truyện Ma', value: 'truyenma' },
];

const SearchPage = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    let keyword = searchParams.get("keyword") || '';

    const [result, setResult] = useState([]);
    const [listBookDoThi, setListBookDoThi] = useState([]);
    const [listBookNgonTinh, setListBookNgonTinh] = useState([]);
    const [listBookTrinhTham, setListBookTrinhTham] = useState([]);
    const [listBookTienHiep, setListBookTienHiep] = useState([]);
    const [listBookLinhDi, setListBookLinhDi] = useState([]);
    const [listBookTruyenMa, setListBookTruyenMa] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [listFavoriteBook, setListFavoriteBook] = useState([]);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const getAllBooks = async (keyword) => {
        console.log(keyword);
        try {
            const res = await axios.get(`http://localhost:5000/api/book/search/`, {
                params: {
                    keyword: keyword,
                }
            });
            console.log(res.data.data);
            if (res.data.success) {
                if (res.data && typeof res.data.data === 'object' && !Array.isArray(res.data.data)) {
                    setListBookDoThi(res.data.data[categories[0].value]);      // "dothi"
                    setListBookTienHiep(res.data.data[categories[1].value]);   // "tienhiep"
                    setListBookTrinhTham(res.data.data[categories[2].value]);  // "trinhtham"
                    setListBookNgonTinh(res.data.data[categories[3].value]);   // "ngontinh"
                    setListBookLinhDi(res.data.data[categories[4].value]);     // "linhdi"
                    setListBookTruyenMa(res.data.data[categories[5].value]);   // "truyenma"
                } else if (Array.isArray(res.data.data)) {
                    setResult(res.data.data);
                }

            }

        } catch (err) {
            console.log(err);
        }
    }

    const getAllBooksRecommend = async (keyword) => {
        if (keyword === '') navigate('/utebook');
        try {
            setIsLoading(true);
            const res = await axios.get(
                `http://localhost:8000/recommendations/${user._id}?n_recommendations=60&bookname=${keyword}`,
            );
            const limitedBooks = res.data.slice(0, 6);
            setAllBooks(limitedBooks);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

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
        const fetchData = async () => {
            try {
                const params = new URLSearchParams(location.search);
                keyword = params.get("keyword") || '';
                setListBookDoThi([]); // Reset listBookDoThi when keyword changes
                setListBookTienHiep([]); // Reset listBookTienHiep when keyword changes
                setListBookTrinhTham([]); // Reset listBookTrinhTham when keyword changes
                setListBookNgonTinh([]); // Reset listBookNgonTinh when keyword changes
                setListBookLinhDi([]); // Reset listBookLinhDi when keyword changes
                setListBookTruyenMa([]); // Reset listBookTruyenMa when keyword changes
                setResult([]);
                setAllBooks([]);
                
                await getAllBooksRecommend(keyword);
                await getAllBooks(keyword);
            } catch (err) {
                console.log(err);
            } finally {
                setTimeout(() => setIsLoading(false), 5000);
            }
        }

        fetchData();

    }, [location.search]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                getUser();
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []
    )

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
                updatedFavoriteBook = listFavoriteBook.includes(bookData.book_id || bookData._id)
                    ? listFavoriteBook
                    : [...listFavoriteBook, bookData.book_id || bookData._id];

                updatedUserFavoriteBook = listUserFavoriteBook.includes(user._id)
                    ? listUserFavoriteBook
                    : [...listUserFavoriteBook, user._id];

            } else {
                updatedFavoriteBook = listFavoriteBook.filter((id) => id !== bookData.book_id || id !== bookData._id);
                updatedUserFavoriteBook = listUserFavoriteBook.filter((id) => id !== user._id);
            }

            const responseUser = await axios.patch(`http://localhost:5000/api/user/${user._id}`, {
                listFavoriteBook: updatedFavoriteBook
            })

            if (responseUser.data.success) {
                setListFavoriteBook(updatedFavoriteBook);
                console.log(updatedFavoriteBook);
                const responseBook = await axios.put(`http://localhost:5000/api/book/books/${bookData.book_id || bookData._id}`, {
                    listUserFavorited: updatedUserFavoriteBook
                });
                if (responseBook.data.success) {
                    setListUserFavoriteBook(updatedUserFavoriteBook);
                    const updatedPage = allBooks.map((item) =>
                        item.book_id || item._id === responseBook.data.data._id ? responseBook.data.data : item
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

    return (
        <div className="search-container">
            <div className="search-result">
                <div className="search-icon">
                    <Search size={24} />
                </div>
                <div className="search-result-title">
                    <h2>Kết quả tìm kiếm cho từ “ <span style={{ color: "#005bbb" }}>{keyword}</span> ”</h2>
                </div>
            </div>
            {isLoading ?
                (
                    <CircleLoading size={100} />
                )
                :
                (
                    <div className="search-page">
                        {result.length > 0 &&
                            <>
                                <p className="search-page-title">Kết quả</p>
                                <CustomImageList
                                    itemData={splitIntoGroups(result, 30)}
                                    page={1}
                                    pageName={"novel"}
                                    handleLikeBook={handleLikeBook}
                                />
                            </>
                        }
                        {allBooks.length > 0 &&
                            <>
                                <p className="search-page-title">UTEBOOK đề xuất</p>
                                <CustomImageList
                                    itemData={splitIntoGroups(allBooks, 30)}
                                    page={1}
                                    pageName={"novel"}
                                    handleLikeBook={handleLikeBook}
                                />
                            </>
                        }
                        {listBookDoThi.length > 0 &&
                            <>
                                <p className="search-page-title">Đô thị</p>
                                <CustomImageList
                                    itemData={splitIntoGroups(listBookDoThi, 30)}
                                    page={1}
                                    pageName={"audio"}
                                    handleLikeBook={handleLikeBook}
                                />
                            </>
                        }
                        {listBookNgonTinh.length > 0 &&
                            <>
                                <p className="search-page-title">Ngôn tình</p>
                                <CustomImageList
                                    itemData={splitIntoGroups(listBookNgonTinh, 30)}
                                    page={1}
                                    pageName={"ebook"}
                                    handleLikeBook={handleLikeBook}
                                />
                            </>
                        }
                        {listBookTruyenMa.length > 0 &&
                            <>
                                <p className="search-page-title">Truyện ma</p>
                                <CustomImageList
                                    itemData={splitIntoGroups(listBookTruyenMa, 30)}
                                    page={1}
                                    pageName={"novel"}
                                    handleLikeBook={handleLikeBook}
                                />
                            </>
                        }
                        {listBookTrinhTham.length > 0 &&
                            <>
                                <p className="search-page-title">Trinh thám</p>
                                <CustomImageList
                                    itemData={splitIntoGroups(listBookTrinhTham, 30)}
                                    page={1}
                                    pageName={"novel"}
                                    handleLikeBook={handleLikeBook}
                                />
                            </>
                        }
                        {listBookLinhDi.length > 0 &&
                            <>
                                <p className="search-page-title">Linh dị</p>
                                <CustomImageList
                                    itemData={splitIntoGroups(listBookLinhDi, 30)}
                                    page={1}
                                    pageName={"novel"}
                                    handleLikeBook={handleLikeBook}
                                />
                            </>
                        }
                        {listBookTienHiep.length > 0 &&
                            <>
                                <p className="search-page-title">Tiên hiệp</p>
                                <CustomImageList
                                    itemData={splitIntoGroups(listBookTienHiep, 30)}
                                    page={1}
                                    pageName={"novel"}
                                    handleLikeBook={handleLikeBook}
                                />
                            </>
                        }
                    </div>
                )
            }


            <CustomAlert alert={alert} handleCloseAlert={handleCloseAlert} />
        </div >
    );
};

export default SearchPage;