import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/SearchPage.scss';
import { useAuth } from "../contexts/AuthContext";

import CustomImageList from "../components/CustomImageList";
import Loading from '../components/Loading';
import CustomAlert from '../components/CustomAlert';
import { Search } from "lucide-react";
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

    const getListBookDoThi = async (keyword) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/book/search/`, {
                params: {
                    keyword: keyword,
                    category: categories[0].label
                }
            });
            setListBookDoThi(res.data.data);
            return res.data.data;
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }

    const getListBookNgonTinh = async (keyword) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/book/search/`,
                {
                    params: {
                        keyword: keyword,
                        category: categories[3].label
                    }
                }
            );
            setListBookNgonTinh(res.data.data);
            return res.data.data;
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }

    const getListBookTrinhTham = async (keyword) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/book/search/`,
                {
                    params: {
                        keyword: keyword,
                        category: categories[2].label
                    }
                }
            );
            setListBookTrinhTham(res.data.data);
            return res.data.data;
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }

    const getListBookTienHiep = async (keyword) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/book/search/`,
                {
                    params: {
                        keyword: keyword,
                        category: categories[1].label
                    }
                }
            );
            setListBookTienHiep(res.data.data);
            return res.data.data;
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }

    const getListBookLinhDi = async (keyword) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/book/search/`,
                {
                    params: {
                        keyword: keyword,
                        category: categories[4].label
                    }
                }
            );
            setListBookLinhDi(res.data.data);
            return res.data.data;
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }

    const getListBookTruyenMa = async (keyword) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/book/search/`,
                {
                    params: {
                        keyword: keyword,
                        category: categories[5].label
                    }
                }
            );
            setListBookTruyenMa(res.data.data);
            return res.data.data;
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }

    const getAllBooksRecommend = async (keyword) => {
        if (keyword === '') navigate('/utebook');
        try {
            setIsLoading(true);
            const res = await axios.get(
                `http://localhost:8000/recommendations/${user._id}?n_recommendations=6&bookname=${keyword}`,
            );
            console.log(res.data);
            setAllBooks(res.data);
            return res.data;
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
                const params = new URLSearchParams(location.search);
                keyword = params.get("keyword") || '';

                await getAllBooksRecommend(keyword);
                await getListBookDoThi(keyword);
                await getListBookNgonTinh(keyword);
                await getListBookTrinhTham(keyword);
                await getListBookTienHiep(keyword);
                await getListBookLinhDi(keyword);
                await getListBookTruyenMa(keyword);

            } catch (err) {
                console.log(err);
            }
        }

        fetchData();

    }, [location.search]);

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
                getUser();
            } catch (err) {
                console.log(err);
            } finally {
                setTimeout(() => setIsLoading(false), 500);
            }
        };
        fetchData();
    }, []);

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
        <div className="search-container">
            <div className="search-result">
                <div className="search-icon">
                    <Search size={24} />
                </div>
                <div className="search-result-title">
                    <h2>Kết quả tìm kiếm cho từ “ <span style={{ color: "#005bbb" }}>{keyword}</span> ”</h2>
                </div>
            </div>


            {!isLoading &&

                <div className="search-page">
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
            }
            <CustomAlert alert={alert} handleCloseAlert={handleCloseAlert} />
        </div>
    );
};

export default SearchPage;