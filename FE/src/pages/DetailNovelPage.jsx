// BookPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import './styles/DetailBookPage.scss';
import bookCover from "../assets/background2.jpg";
import { Star, BookOpen, Heart, Crown } from 'lucide-react';
import ChapterItem from '../components/ChapterItem';

const formatDescription = (description) => {
  const parts = description.split('\n\n');
  const shortDesc = parts[0];

  // Xử lý phần bullet points
  const bulletPoints = parts.find(part => part.includes('•'))?.split('•').filter(Boolean) || [];

  return {
    short: shortDesc,
    full: parts.filter(part => !part.includes('•')),
    bulletPoints: bulletPoints.map(point => point.trim())
  };
};

const invalidCategory = [
  { value: 'Đô thị' },
  { value: 'Tiên hiệp' },
  { value: 'Trinh thám' },
  { value: 'Ngôn tình' },
  { value: 'Linh dị' },
  { value: 'Truyện ma' },
];

const showCategories = (categories) => {
  const theLoai = categories.flatMap(category => category.split(',').map(str => str.trim().toLowerCase()));
  const filteredCategories = theLoai.filter((category) =>
    invalidCategory.some((invalid) =>
      category.toLowerCase().includes(invalid.value.toLowerCase())
    )
  );

  return filteredCategories.map(category =>
    category
      .split(' ') // Tách thành các từ
      .filter(word => word.toLowerCase() !== 'truyện') // Loại bỏ từ "truyen"
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Viết hoa chữ cái đầu mỗi từ còn lại
      .join(' ') // Ghép lại thành chuỗi
  );
};

const DetailBookPage = () => {
  const { idNovel } = useParams();
  const navigate = useNavigate();

  const [bookName, setBookName] = useState('');
  const [bookImage, setBookImage] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [rated, setRated] = useState('');
  const [chapters, setChapters] = useState([]);

  const [showFullSummary, setShowFullSummary] = useState(false);

  const ratings = {
    5: 2,  // 2 đánh giá 5 sao
    4: 3,  // 3 đánh giá 4 sao
    3: 5,  // 5 đánh giá 3 sao
    2: 0,  // 0 đánh giá 2 sao
    1: 0   // 0 đánh giá 1 sao
  };

  // Tính tổng số đánh giá
  const totalRatings = Object.values(ratings).reduce((a, b) => a + b, 0);

  // Tính điểm trung bình
  const averageRating = Object.entries(ratings).reduce((acc, [star, count]) => {
    return acc + (Number(star) * count);
  }, 0) / totalRatings;

  const calculatePercentage = (starCount) => {
    if (totalRatings === 0) return 0;
    return (ratings[starCount] / totalRatings) * 100;
  };
  const handleShowMore = () => {
    setShowFullSummary(!showFullSummary);
  };

  useEffect(() => {
    const getBookById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/book/books/${idNovel}`);

        const bookData = response.data.data;
        setBookName(bookData.bookname);
        setBookImage(bookData.image);
        setAuthor(bookData.author);
        setPublisher(bookData.publisher);
        setCategories(showCategories(bookData.categories));
        console.log(showCategories(bookData.categories))
        setDescription(bookData?.description || 'Đang cập nhật');
        setType(bookData.type);
        setRated(bookData.ageLimit);

        if (bookData.chapterIds !== null) {
          try {
            const chapterPromises = bookData.chapterIds.map(async (chapter) => {
              try {
                const response = await axios.get(`http://localhost:5000/api/chapter/chapter/${chapter}`);
                return response.data.data; // trả về data nếu request thành công
              } catch (error) {
                console.error(`Error fetching chapter ${chapter}:`, error);
                return null; // nếu có lỗi, trả về null để không ảnh hưởng đến các chapter khác
              }
            });
            const chaptersData = await Promise.all(chapterPromises);

            const validChapters = chaptersData.filter((chapter) => chapter !== null);
            setChapters(validChapters);

            console.log(validChapters); // Log các chapter hợp lệ
          } catch (error) {
            console.error('Error fetching chapters:', error);
          }
        }

      }
      catch (err) {
        console.log(err);
      }
    };
    getBookById();
  }, []);

  return (
    <div className="book-page">
      <nav className="navigation">
        <div className="nav-link">
          <a href="/utebook">Trang chủ</a> &gt; {bookName}
        </div>
      </nav>

      <div className="content-container">
        <div className="book-details">
          <div className="book-cover">
            <img src={bookImage || bookCover} alt="Book cover" />
            <div className="member-badge">
              HỘI VIÊN <Crown />
            </div>
          </div>

          <div className="book-info">
            <h1 className="book-title">{bookName}</h1>

            <div className="book-rating">
              <span className="rating-value">5</span>
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="star-icon" fill="#FFD700" color="#FFD700" />
              ))}
              <span className="rating-count">• 1 đánh giá</span>
            </div>

            <div className="book-ranking">
              <div className="rank-badge">#20</div>
              <span className="rank-text">trong Top xu hướng Sách điện tử</span>
            </div>

            <div className="book-metadata">
              <div className="metadata-section">
                <div className="metadata-label">Tác giả</div>
                <div className="metadata-value">{author}</div>
                <div className="metadata-label">Nhà xuất bản</div>
                <div className="metadata-value">{publisher || "Đang cập nhật"}</div>
              </div>

              <div className="metadata-section">
                <div className="metadata-label">Thể loại</div>
                <div className="metadata-value">
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <p
                        key={category}
                        className="category-item"  // Assuming you want to apply some styles here
                        onClick={() => navigate(`/utebook/novel/${category}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {category}
                      </p>
                    ))
                  ) : (
                    "Đang cập nhật"
                  )}
                </div>

                <div className="metadata-label">Gói cước</div>
                <div className="metadata-value">Hoa phượng</div>
              </div>

              <div className="metadata-section">
                <div className="metadata-label">Tình trạng</div>
                <div className="metadata-value">Đang cập nhật</div>
                <div className="metadata-label">Xếp hạng</div>
                <div className="metadata-value">{rated}+</div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="read-btn"
                onClick={() => navigate(`/utebook-reader/6812446658f389d6680c07c1`)}
              >
                <BookOpen size={20} />
                Đọc từ đầu
              </button>
              <button className="continue-read-btn">
                <BookOpen size={20} />
                Đọc tiếp
              </button>
              <button className="like-btn">
                <Heart size={20} />
              </button>
            </div>

            <div className="book-summary">
              <h3>Tóm tắt sách</h3>
              <div className={`summary-content ${showFullSummary ? 'expanded' : ''}`}>
                <p>{formatDescription(description).short}</p>
                {showFullSummary && (
                  <>
                    {formatDescription(description).full.slice(1).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </>
                )}
              </div>
              <button className="read-more" onClick={handleShowMore}>
                {showFullSummary ? 'Thu gọn' : 'Xem thêm'}
              </button>
            </div>

            <div className="list-chapter">
              <span className='list-chapter-title'> Danh sách chương</span>
              <div className='list-chapter-item'>
                <ChapterItem
                  chapterTitle={"Ngoại truyện 4: Một vài mẩu chuyển vụn vặt về “cơm chó” của vợ chồng nhà nọ"}
                  chapterNumber={1}
                  wordCount={1000}
                  hoaPhuongAmount={0}
                  bookName={bookName}
                />
              </div>
              <div className='list-chapter-item'>
                <ChapterItem
                  chapterTitle={"Ngoại truyện 4: Một vài mẩu chuyển vụn vặt về “cơm chó” của vợ chồng nhà nọ"}
                  chapterNumber={1}
                  wordCount={1000}
                  hoaPhuongAmount={100}
                  bookName={bookName}
                />
              </div>
            </div>

            <div className="book-reviews">
              <span className='book-reviews-title'> Độc giả nói gì về "{bookName}"</span>
              <div className="review-tabs">
                <button className="tab">Đánh giá & nhận xét (3)</button>
              </div>

              <div className="rating-summary">
                <div className="rating-score">
                  <h2>{averageRating.toFixed(1)}</h2>
                  <p>{totalRatings} đánh giá</p>
                </div>
                <div className="rating-bars">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="rating-bar">
                      <div className="stars">
                        {Array(star).fill().map((_, i) => (
                          <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
                        ))}
                      </div>
                      <div className="bar-container">
                        <div className="bar" style={{ width: `${calculatePercentage(star)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="write-review-btn">
                <span>Viết đánh giá</span>
              </button>

              <div className="reviews-list">
                <div className="review-item">
                  <div className="reviewer-info">
                    <div className="avatar">H</div>
                    <div className="info">
                      <h4>Hiếu Ngô</h4>
                      <div className="rating">
                        {Array(5).fill().map((_, i) => (
                          <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
                        ))}
                      </div>
                    </div>
                    <div className="review-date">12/03/2025</div>
                  </div>
                  <p className="review-content">ok</p>
                </div>

                <div className="review-item">
                  <div className="reviewer-info">
                    <div className="avatar">
                      <img src="path_to_avatar" alt="Avatar" />
                    </div>
                    <div className="info">
                      <h4>ô lạt na trát</h4>
                      <div className="rating">
                        {Array(5).fill().map((_, i) => (
                          <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
                        ))}
                      </div>
                    </div>
                    <div className="review-date">26/08/2024</div>
                  </div>
                  <p className="review-content">đọc xong hiểu được nhiều điều hơn</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="subscription-card">
          <div className="subscription-header">
            <h2>ĐỌC & NGHE SÁCH KHÔNG GIỚI HẠN</h2>
          </div>
          <div className="subscription-content">
            <p>Sách này và 20,000+ sách điện tử, sách nói, truyện tranh...</p>
            <div className="price">1.000đ<span>/ngày</span></div>
            <button className="subscribe-btn">Trở thành hội viên</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBookPage;