
import PropTypes from "prop-types";
import "./styles/BookDetail.scss";
import CloseIcon from "@mui/icons-material/Close";

const BookDetail = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <div className="book-detail-overlay">
      <div className="book-detail-modal">
        <button className="close-btn" onClick={onClose}>
          <CloseIcon />
        </button>
        <div className="book-content">
          <img src={book.cover} alt={book.title} className="book-cover" />
          <div className="book-info">
            <h2 className="book-title">{book.title}</h2>
            <p><strong>Tác giả:</strong> {book.author}</p>
            <p><strong>Thể loại:</strong> {book.genre}</p>
            <p><strong>Giá:</strong> {book.price.toLocaleString()} VND</p>
            <p className="book-description">
              <strong>Mô tả:</strong> Đây là nội dung mô tả ngắn gọn về cuốn sách. Bạn có thể đọc nội dung chi tiết bằng cách nhấn vào nút dưới đây.
            </p>
            <button className="read-btn">Đọc ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
};

BookDetail.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    cover: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BookDetail;
