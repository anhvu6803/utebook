import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/RecommendationBook.scss"; // Import the SCSS file for styling

import SliderImageBook from "./SliderImageBook";
import CustomTitleCategory from "./CustomTitleCategory";

import { BookOpen, Play } from "lucide-react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

function RecommendationBook({ pageName, category }) {
    const navigate = useNavigate();
    const [isShow, setIsShow] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("Chọn thể loại");
    const [indexBook, setIndexBook] = useState(0);
    const [isViewLiked, setIsViewLiked] = useState(bookContents.map(book => book.isLiked));

    const handleCategoryChange = (value) => {
        navigate(`/utebook/${pageName}/${value}`);
        setSelectedCategory(value);
    };

    const handleLikeBook = (index) => {
        setIsViewLiked((prevLikes) => {
            const newLikes = [...prevLikes];
            newLikes[index] = !newLikes[index];
            return newLikes;
        });
        bookContents[index].isLiked = isViewLiked[index];
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
                    <p className="title-book">{bookContents[indexBook].title}</p>
                    {bookContents[indexBook].description.map(
                        (des, index) => (
                            <p key={index} className="description">
                                {des}
                            </p>
                        )
                    )}
                </div>

                <div className="book-actions">
                    <button className="btn-read">
                        <BookOpen />
                        Đọc ngay
                    </button>
                    {bookContents[indexBook].isAudio &&
                        <button className="btn-play">
                            <Play />
                        </button>
                    }
                    <button
                        className="btn-favorite"
                        onClick={() => handleLikeBook(indexBook)}
                    >
                        {isViewLiked[indexBook] ? (
                            <FavoriteIcon />
                        ) : (
                            <FavoriteBorderIcon />
                        )}
                    </button>
                </div>

            </div>
            <div className='main-swiper'>
                <SliderImageBook
                    images={images}
                    isShow={isShow}
                    setIndexBook={setIndexBook}
                />
            </div>
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

const categories = [
    { label: 'Tiểu thuyết', value: 'tieu-thuyet' },
    { label: 'Phi hư cấu', value: 'phi-hu-cau' },
    { label: 'Khoa học viễn tưởng', value: 'khoa-hoc-vien-tuong' },
    { label: 'Giả tưởng', value: 'gia-tuong' },
    { label: 'Hồi ký', value: 'hoi-ky' },
    { label: 'Trinh thám', value: 'trinh-tham' },
    { label: 'Lãng mạn', value: 'lang-man' },
    { label: 'Lịch sử', value: 'lich-su' },
    { label: 'Kinh dị', value: 'kinh-di' },
    { label: 'Tự giúp', value: 'tu-giup' }
];

const images = [
    { id: 1, image: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
    { id: 2, image: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
    { id: 3, image: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
    { id: 4, image: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
    { id: 5, image: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
    { id: 6, image: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
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