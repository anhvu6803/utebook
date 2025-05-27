import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/RecommendationBook.scss"; // Import the SCSS file for styling

import SliderImageBook from "./SliderImageBook";
import CustomTitleCategory from "./CustomTitleCategory";

import { BookOpen, Play } from "lucide-react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CustomAlert from '../components/CustomAlert';

const setCategoriesForPage = (pageName) => {
    if (pageName === 'novel') {
        return categoriesNovel;
    }
    else if (pageName === 'ebook') {
        return categoriesEbook;
    }
    else if (pageName === 'audio') {
        return categoriesAudio;
    }
    else if (pageName === 'creative') {
        return categoriesCreative;
    }
}

function RecommendationBook({ pageName, category, listBooks }) {
    const navigate = useNavigate();
    const categories = setCategoriesForPage(pageName);


    const listBooksTemp = listBooks?.map(book => book) || bookContents;
    const listImagesTemp = listBooks?.map(book => book.image) || imageBooks;

    const [isShow, setIsShow] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("Chọn thể loại");
    const [indexBook, setIndexBook] = useState(0);
    const [books, setBooks] = useState([]);
    const [imageBooks, setBookImages] = useState([]);

    const getListBooksByCategory = async (category) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/book/random-books/${category}`,
            );
            setBooks(res.data.data);
            setBookImages(res.data.data.map(book => book.image));
        } catch (err) {
            console.log(err);
        }
    }
    const handleCategoryChange = (value) => {
        navigate(`/utebook/${pageName}/${value}`);
        window.location.reload();
        setSelectedCategory(value);
        if (pageName === 'novel') {
            getListBooksByCategory(value);
        }
    };

    const handleShowBookId = (index) => {
        if (books.length <= 0) return listBooksTemp[index]?._id;
        return books[index]?._id;
    };
    const handleShowBookName = (index) => {
        if (books.length <= 0) return listBooksTemp[index]?.bookname;
        return books[index]?.bookname;
    };

    const handleShowBookDescription = (index) => {
        if (books.length <= 0) return listBooksTemp[index]?.description;
        return books[index]?.description;
    };
    const handleShowImages = () => {
        if (imageBooks.length <= 0) return listImagesTemp;
        return imageBooks;
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };
    return (
        <div className="book-recommend-container"
            onMouseEnter={() => setIsShow('show')} // Mở khi di chuột vào
            onMouseLeave={() => setIsShow('')} // Đóng khi rời chuót khỏi menu
        >
            <div className="more-content">
                <div className="category-container">
                    <CustomTitleCategory
                        category={category}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        handleCategoryChange={handleCategoryChange}
                        pageValue={pageNames.find((name) => name.value === pageName)}
                    />
                </div>

                <div className="description-container">
                    <span className="tab-recommend">UTEBOOK đề xuất</span>
                    <p className="title-book">{handleShowBookName(indexBook) || 'Đang cập nhật'}</p>
                    <div className="description">
                        {
                            handleShowBookDescription(indexBook)
                            || "Hiện đang cập nhật mô tả"
                        }
                    </div>
                </div>

                <div className="book-actions">
                    <button
                        className="btn-read"
                        onClick={() => navigate(`/utebook/${pageName}/view/${handleShowBookId(indexBook)}`)}
                    >
                        <BookOpen />
                        Đọc ngay
                    </button>
                    {/* {bookContents[indexBook].isAudio &&
                        <button className="btn-play">
                            <Play />
                        </button>
                    } */}

                </div>

            </div>
            <div className='main-swiper'>
                <SliderImageBook
                    images={handleShowImages()}
                    isShow={isShow}
                    setIndexBook={setIndexBook}
                />
            </div>
            <CustomAlert alert={alert} handleCloseAlert={handleCloseAlert} />
        </div>
    );
}

export default RecommendationBook;

const pageNames = [
    { label: 'Sách điện tử', value: 'ebook' },
    { label: 'Sách nói', value: 'audio' },
    { label: 'Sách truyện', value: 'novel' },
    { label: 'Podcast', value: 'podcast' },
    { label: 'Sáng tác', value: 'creative' }
]

const categoriesNovel = [
    { label: 'Đô thị', value: 'Đô thị' },
    { label: 'Tiên hiệp', value: 'Tiên hiệp' },
    { label: 'Trinh thám', value: 'Trinh thám' },
    { label: 'Ngôn tình', value: 'Ngôn tình' },
    { label: 'Linh dị', value: 'Linh dị' },
    { label: 'Truyện Ma', value: 'Truyện Ma' },
];

const categoriesEbook = [
    { label: 'Đô thị', value: 'do-thi' },
    { label: 'Tiên hiệp', value: 'tien-hiep' },
    { label: 'Trinh thám', value: 'trinh-tham' },
    { label: 'Ngôn tình', value: 'ngon-tinh' },
    { label: 'Linh dị', value: 'linh-di' },
    { label: 'Truyện ma', value: 'truyen-ma' },
];
const categoriesCreative = [
    { label: 'Đô thị', value: 'do-thi' },
    { label: 'Tiên hiệp', value: 'tien-hiep' },
    { label: 'Trinh thám', value: 'trinh-tham' },
    { label: 'Ngôn tình', value: 'ngon-tinh' },
    { label: 'Linh dị', value: 'linh-di' },
    { label: 'Truyện ma', value: 'truyen-ma' },
];
const categoriesAudio = [
    { label: 'Đô thị', value: 'do-thi' },
    { label: 'Tiên hiệp', value: 'tien-hiep' },
    { label: 'Trinh thám', value: 'trinh-tham' },
    { label: 'Ngôn tình', value: 'ngon-tinh' },
    { label: 'Linh dị', value: 'linh-di' },
    { label: 'Truyện ma', value: 'truyen-ma' },
];
const images = [
    'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
];

const bookContents = [
    {
        title: 'Nếu không nỗ lực, ai sẽ chăm chỉ thay bạn',
        description: [
            'Bạn có đang: ',
            'Mơ hồ về tương lai, thiếu động lực phấn đấu? ',
            'Dễ dàng bỏ cuộc trước khó khăn, thử thách?',
            'So sánh bản thân với người khác và cảm thấy tự ti?',
        ],
        isAudio: false,
        isLiked: false
    },
    {
        title: 'Vết thương hoa hồng',
        description: [
            'Tiểu thuyết “Vết thương hoa hồng” độc giả không chỉ được chìm trong những câu văn đẹp về con người và phong cảnh miền quê Việt Nam mà còn bị ám ảnh bởi những lớp nghĩa ẩn mà tác giả muốn truyền tải. “Vết thương hoa hồng” là tác phẩm chạm được vào những vấn đề đang nhức nhối của những miền quê đang đứng trước sự thay đổi diện mạo từng ngày. Qua lăng kính của tác giả bất kỳ ai',
        ],
        isAudio: true,
        isLiked: false
    },
    {
        title: 'Nếu không nỗ lực, ai sẽ chăm chỉ thay bạn',
        description: [
            'Bạn có đang: ',
            'Mơ hồ về tương lai, thiếu động lực phấn đấu? ',
            'Dễ dàng bỏ cuộc trước khó khăn, thử thách?',
            'So sánh bản thân với người khác và cảm thấy tự ti?',
        ],
        isAudio: false,
        isLiked: false
    },
    {
        title: 'Nếu không nỗ lực, ai sẽ chăm chỉ thay bạn',
        description: [
            'Bạn có đang: ',
            'Mơ hồ về tương lai, thiếu động lực phấn đấu? ',
            'Dễ dàng bỏ cuộc trước khó khăn, thử thách?',
            'So sánh bản thân với người khác và cảm thấy tự ti?',
        ],
        isAudio: true,
        isLiked: false
    },
    {
        title: 'Nếu không nỗ lực, ai sẽ chăm chỉ thay bạn',
        description: [
            'Bạn có đang: ',
            'Mơ hồ về tương lai, thiếu động lực phấn đấu? ',
            'Dễ dàng bỏ cuộc trước khó khăn, thử thách?',
            'So sánh bản thân với người khác và cảm thấy tự ti?',
        ],
        isAudio: true,
        isLiked: false
    },
    {
        title: 'Nếu không nỗ lực, ai sẽ chăm chỉ thay bạn',
        description: [
            'Bạn có đang: ',
            'Mơ hồ về tương lai, thiếu động lực phấn đấu? ',
            'Dễ dàng bỏ cuộc trước khó khăn, thử thách?',
            'So sánh bản thân với người khác và cảm thấy tự ti?',
        ],
        isAudio: false,
        isLiked: false
    }
];