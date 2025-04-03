// BookPage.jsx
import React from 'react';
import './styles/DetailBookPage.scss';
import bookCover from "../assets/background2.jpg";
import { Star, BookOpen, Play, Heart, Crown, Share2 } from 'lucide-react';

const DetailBookPage = () => {
  const [showFullSummary, setShowFullSummary] = React.useState(false);

  // Giả sử đây là dữ liệu từ database
  const bookDescription = `Ở Việt Nam, nhắc đến Đắc Nhân Tâm của Dale Carnegie là nhắc đến một cuốn sách gối đầu giường của biết bao thế hệ. Cuốn sách đã có hơn 70 năm gắn bó cùng độc giả Việt Nam kể từ lần xuất bản đầu tiên vào năm 1951 qua bản dịch "Đắc Nhân Tâm - Bí quyết thành công" của học giả Nguyễn Hiến Lê.Trong 70 năm có mặt tại Việt Nam, cuốn sách đã giúp rất nhiều người thành công nhờ áp dụng những triết lí này. Ông Phạm Phú Ngọc Trai, Chủ tịch và Tổng Giám đốc PepsiCo Đông Dương chia sẻ: "Đắc Nhân Tâm không đơn thuần là cách cư xử chỉ để được lòng người. Đó là một trong những nhận thức hình thành nhân cách con người theo những tiêu chuẩn giá trị được đa số đồng ý và chia sẻ." Hi vọng rằng, cuốn sách sẽ tiếp tục giúp những thế hệ tiếp theo của người Việt trở nên tốt đẹp, chân thành, được mọi người yêu quý và thành công hơn.Cuốn sách này sẽ cung cấp cho bạn những nguyên tắc để giúp bạn ứng xử khéo léo trong từng trường hợp với:
• 3 quy tắc ứng xử cơ bản
• 6 cách để gây thiện cảm ban đầu
• 12 cách dẫn người khác theo suy nghĩ của bạn
• 9 cách khiến người khác thay đổi mà không gây oán giận

Waka xin trân trọng giới thiệu Đắc Nhân Tâm - Dale Carnegie!`;

  // Giả sử đây là dữ liệu đánh giá từ database
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

  // Tính phần trăm cho mỗi mức sao
  const calculatePercentage = (starCount) => {
    if (totalRatings === 0) return 0;
    return (ratings[starCount] / totalRatings) * 100;
  };

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

  const formattedDesc = formatDescription(bookDescription);

  const handleShare = () => {
    // Implement the share functionality
  };

  const handleShowMore = () => {
    setShowFullSummary(!showFullSummary);
  };

  return (
    <div className="book-page">
      <nav className="navigation">
        <div className="nav-link">
          <a href="/">Trang chủ</a> &gt; 101 cách cưa đổ đại lão hàng xóm - Tập 9
        </div>
      </nav>

      <div className="content-container">
        <div className="book-details">
          <div className="book-cover">
            <img src={bookCover} alt="Book cover" />
            <div className="member-badge">
              HỘI VIÊN <Crown />
            </div>
          </div>

          <div className="book-info">
            <h1 className="book-title">101 cách cưa đổ đại lão hàng xóm - Tập 9</h1>

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
                <div className="metadata-value">Đồng Vụ</div>
                <div className="metadata-label">Nhà xuất bản</div>
                <div className="metadata-value">Đang Cập Nhật</div>
              </div>

              <div className="metadata-section">
                <div className="metadata-label">Thể loại</div>
                <div className="metadata-value">Ngôn tình</div>
                <div className="metadata-label">Gói cước</div>
                <div className="metadata-value">Hội viên</div>
              </div>

              <div className="metadata-section">
                <div className="metadata-label">Tình trạng</div>
                <div className="metadata-value">9/50</div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="read-btn">
                <BookOpen size={20} />
                Đọc sách
              </button>
              <button className="play-btn">
                <Play size={20} />
              </button>
              <button className="like-btn">
                <Heart size={20} />
              </button>
            </div>

            <div className="book-summary">
              <h3>Tóm tắt sách</h3>
              <div className={`summary-content ${showFullSummary ? 'expanded' : ''}`}>
                <p>{formattedDesc.short}</p>
                {showFullSummary && (
                  <>
                    {formattedDesc.full.slice(1).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                    {formattedDesc.bulletPoints.length > 0 && (
                      <>
                        <p>Cuốn sách này sẽ cung cấp cho bạn những nguyên tắc để giúp bạn ứng xử khéo léo trong từng trường hợp với:</p>
                        <ul>
                          {formattedDesc.bulletPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </div>
              <button className="read-more" onClick={handleShowMore}>
                {showFullSummary ? 'Thu gọn' : 'Xem thêm'}
              </button>
            </div>

            <div className="book-reviews">
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