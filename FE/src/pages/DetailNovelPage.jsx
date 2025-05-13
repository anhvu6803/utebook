// BookPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import './styles/DetailBookPage.scss';
import bookCover from "../assets/background2.jpg";

import { Star, BookOpen, Crown, MoveDown, MoveUp, Flower, Award } from 'lucide-react';
import ChapterItem from '../components/ChapterItem';
import PaginationButtons from '../components/PaginationButtons';
import { useAuth } from "../contexts/AuthContext";
import SorryForm from '../components/SorryForm';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CustomAlert from '../components/CustomAlert';

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

const splitIntoGroups = (inputList, reverse, chunkSize) => {
  const result = [];
  const chapterList = sortChapters(inputList, reverse);

  for (let i = 0; i < chapterList.length; i += chunkSize) {
    result.push(chapterList.slice(i, i + chunkSize));
  }

  return result;
}

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
  const filteredCategories = theLoai.map(category => {
    const words = category.split(' ');
    if (
      words.length === 2 &&
      words[0].toLowerCase() === 'truyện' &&
      words[1].toLowerCase() === 'ma'
    ) {
      return words
        .map(
          word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
    }

    // Với các category khác, loại từ "truyen" nếu có
    const cleanedWords = words.filter(
      word => word.toLowerCase() !== 'truyện'
    );

    return cleanedWords
      .map(
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  });

  return filteredCategories.filter(category =>
    invalidCategory.some((invalid) =>
      category.toLowerCase() === invalid.value.toLowerCase()
    )
  );
};

const parseChapterName = (chapterName) => {
  const match = chapterName.match(/^Chương\s+(\d+)[\s_:.-]*\s*(.+)?$/i);
  if (match) {
    return {
      chapterNumber: parseInt(match[1], 10),
      title: match[2] ? match[2].trim() : ''
    };
  } else {
    return {
      chapterNumber: null,
      title: chapterName.trim()
    };
  }
};

const sortChapters = (chapterList, reverse = false) => {
  return chapterList
    .map(ch => ({
      ...ch,
      _parsed: parseChapterName(ch.chapterName)
    }))
    .filter(ch => ch._parsed.chapterNumber !== null)
    .sort((a, b) =>
      reverse
        ? b._parsed.chapterNumber - a._parsed.chapterNumber
        : a._parsed.chapterNumber - b._parsed.chapterNumber
    )
    .map(({ _parsed, ...original }) => original); // Trả lại object gốc, bỏ `_parsed`
};

const showTypeBook = (type) => {
  if (type === 'Free') return { name: 'Miễn phí', icon: <Award /> };
  else if (type === 'Member') return { name: 'Hội viên', icon: <Crown /> }; // 'Hội viên'
  else if (type === 'HoaPhuong') return { name: 'Hoa phượng', icon: <Flower /> } // 'Hoa phượng'
}

const DetailBookPage = () => {
  const { idNovel } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const chapterpage = parseInt(searchParams?.get('chapterpage') || 1, 10);

  //book detail
  const [bookName, setBookName] = useState('');
  const [bookImage, setBookImage] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [intialType, setInitialType] = useState('');
  const [rated, setRated] = useState('');
  const [chapters, setChapters] = useState([]);
  const [listBookRead, setListBookRead] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [listReview, setListReview] = useState([]);
  const [avegradeRate, setAvegradeRate] = useState(0);

  const [showFullSummary, setShowFullSummary] = useState(false);
  const [open, setOpen] = useState(false);
  const [isReverseChapter, setIsReverseChapter] = useState(false);

  const [chapterReading, setChapterReading] = useState('');
  const [isReading, setIsReading] = useState(false);

  const [listFavoriteBook, setListFavoriteBook] = useState([]);

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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

  // get detail book
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
        setDescription(bookData?.description || 'Đang cập nhật');
        setType(showTypeBook(bookData.type));
        setInitialType(bookData.type);
        setRated(bookData.ageLimit);
        setListBookRead(bookData.listReading);
        setIsFavorite(bookData.isFavorite);
        setListReview(bookData.listReview);
        setAvegradeRate(bookData.avegradeRate);

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
            setChapters(sortChapters(validChapters)); // sắp xếp lịch sử cơ bản (validChapters);

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

  // // get history reading 
  // useEffect(() => {
  //   const getHistoryReading = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:5000/api/history-readings/`,
  //         {
  //           params: {
  //             userId: user._id,
  //             bookId: idNovel,
  //           },
  //         }
  //       );
  //       if (response.data.success) {
  //         setChapterReading(response.data.data.chapterId);
  //         setIsReading(true);
  //       }
  //     }
  //     catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getHistoryReading();
  // })

  // get user
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
  })

  const handlePageChange = (event, value) => {
    const currentPath = location.pathname;
    navigate(`${currentPath}?chapterpage=${value}`);
  };
  const handleReverseChapter = () => {
    setIsReverseChapter(!isReverseChapter);
  }

  const handleLikeBook = async (value) => {
    const temp = !value;
    setIsFavorite(temp);
    try {

      let updated;
      if (temp) {
        // Nếu đang muốn thêm sách vào danh sách yêu thích
        updated = listFavoriteBook.includes(idNovel)
          ? listFavoriteBook // nếu đã có rồi thì giữ nguyên
          : [...listFavoriteBook, idNovel]; // nếu chưa có thì thêm newId vào
      } else {
        // Nếu đang muốn xoá sách khỏi danh sách yêu thích
        updated = listFavoriteBook.filter((id) => id !== idNovel);
      }

      const responseUser = await axios.patch(`http://localhost:5000/api/user/${user._id}`, {
        listFavoriteBook: updated
      })

      if (responseUser.data.success) {
        setListFavoriteBook(updated);
        const responseBook = await axios.put(`http://localhost:5000/api/book/books/${idNovel}`, {
          isFavorite: temp // Gửi danh sách mới, không bị lỗi bất đồng bộ
        });
        if (responseBook.data.success) {
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
      setIsFavorite(!temp);
      setAlert({
        open: true,
        message: 'Có lỗi khi thêm sách vào phần yêu thích',
        severity: 'error'
      });
      console.error(err);
    }
  }

  const handleReadingBook = async (listReadingBook) => {
    if (!isReading) {
      try {
        const response = await axios.post('http://localhost:5000/api/history-readings/', {
          userId: user._id,
          bookId: idNovel,
          chapterId: chapters[0]._id,
        });

        if (response.data.success) {
          const newId = response.data.data._id;

          const updated = listReadingBook.includes(newId)
            ? listReadingBook
            : [...listReadingBook, newId];

          setListBookRead(updated); // Cập nhật state

          await axios.put(`http://localhost:5000/api/book/books/${idNovel}`, {
            listReading: updated // Gửi danh sách mới, không bị lỗi bất đồng bộ
          });

          console.log("Cập nhật thành công:", updated);
        }
      } catch (err) {
        console.error(err);
      }
    }

    navigate(`/utebook-reader/${chapters[0]._id}`)
  }

  // show alert
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };
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
            <div className={`book-badge ${intialType.toLowerCase()}`}>
              {type?.name?.toUpperCase()} {type?.icon}
            </div>
          </div>

          <div className="book-info">
            <h1 className="book-title">{bookName}</h1>

            <div className="book-rating">
              <span className="rating-value">{avegradeRate}</span>
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="star-icon" fill="#FFD700" color="#FFD700" />
              ))}
              <span className="rating-count">• {listReview.length} đánh giá</span>
            </div>

            {/* <div className="book-ranking">
              <div className="rank-badge">#20</div>
              <span className="rank-text">trong Top xu hướng Sách điện tử</span>
            </div> */}

            <div className="book-metadata">
              <div className="metadata-section">
                <div className="metadata-label">Tác giả</div>
                <div className="metadata-value">{author}</div>
                <div className="metadata-label">Nhà xuất bản</div>
                <div className="metadata-value">{publisher || "Đang cập nhật"}</div>
              </div>

              <div className="metadata-section">
                <div className="metadata-label">Thể loại</div>
                <div
                  className="metadata-value"
                  onClick={() => setOpen(!open)}
                >
                  {categories && categories.length > 0 ? (
                    <>
                      {categories[0]}
                      <span
                        className="dropdown-icon"
                      >▼</span>
                      {open && (
                        <div style={{
                          position: 'absolute',
                          zIndex: 1000,
                        }}>
                          <div className="dropdown">
                            {categories.map((cat, index) => (
                              <div
                                key={index}
                                className="dropdown-item"
                                onClick={() => navigate(`/utebook/novel/${cat}`)}
                              >
                                {cat}
                              </div>
                            ))}
                          </div>

                        </div>
                      )}
                    </>
                  ) : (
                    "Đang cập nhật"
                  )}
                </div>

                <div className="metadata-label">Gói cước</div>
                <div className="metadata-value">{type.name}</div>
              </div>

              <div className="metadata-section">
                <div className="metadata-label">Tình trạng</div>
                <div className="metadata-value">Đang cập nhật</div>
                <div className="metadata-label">Xếp hạng</div>
                <div className="metadata-value">{rated}+</div>
              </div>
            </div>

            <div className="action-buttons">
              <SorryForm
                isReading={chapters.length > 0}
                handleReadingBook={handleReadingBook}
                listBookRead={listBookRead}
              />
              {isReading && (
                <button className="continue-read-btn"
                  onClick={() => navigate(`/utebook-reader/${chapterReading}`)}
                >
                  <BookOpen size={20} />
                  Đọc tiếp
                </button>
              )}
              <button
                className="like-btn"
                onClick={() => handleLikeBook(isFavorite)}
              >
                {isFavorite ?
                  (
                    <FavoriteIcon size={20} />
                  ) : (
                    <FavoriteBorderIcon size={20} />
                  )}
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
              <div className="list-chapter-title-container">
                <span className='list-chapter-title'> Danh sách chương</span>
                <div
                  className="group-svg"
                  onClick={() => handleReverseChapter()}
                >
                  <span className='svg-title'> {isReverseChapter ? 'Mới nhất' : 'Cũ nhất'}</span>
                  <MoveDown className='svg-left' color={`${isReverseChapter ? 'black' : '#ccc'}`} />
                  <MoveUp className='svg-right' color={`${!isReverseChapter ? 'black' : '#ccc'}`} />
                </div>
              </div>
              {chapters?.length > 0 ?
                (
                  splitIntoGroups(chapters, isReverseChapter, 3)[chapterpage - 1]?.map((chapter, index) => (
                    <div
                      className='list-chapter-item'
                      key={index}
                    >
                      <ChapterItem
                        chapterTitle={parseChapterName(chapter.chapterName).title}
                        chapterNumber={parseChapterName(chapter.chapterName).chapterNumber}
                        hoaPhuongAmount={chapter.price}
                        bookName={bookName}
                      />
                    </div>
                  ))
                )
                :
                (
                  "Chương sách đang cập nhật"
                )
              }
              <PaginationButtons
                count={Math.ceil(chapters?.length / 3)}
                page={chapterpage}
                handlePageChange={handlePageChange}
              />
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
            <button
              className="subscribe-btn"
              onClick={() => navigate('/utebook/package-plan')}
            >
              Trở thành hội viên
            </button>
          </div>
        </div>
      </div>

      <CustomAlert alert={alert} handleCloseAlert={handleCloseAlert} />
    </div >
  );
};

export default DetailBookPage;