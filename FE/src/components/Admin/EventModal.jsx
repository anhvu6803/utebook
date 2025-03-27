import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "./styles/EventModal.scss";
import CustomDateInput from './CustomDateInput';
import BookSelectionModal from './BookSelectionModal';

const EventModal = ({ isOpen, onClose, onSubmit, event = null }) => {
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    } catch (error) {
      return '';
    }
  };

  const formatDateForSubmit = (dateString) => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Sắp diễn ra",
    discountedBooks: []
  });

  const [selectedBooks, setSelectedBooks] = useState([]);
  const [bookDiscount, setBookDiscount] = useState({
    bookId: "",
    discountPercent: 10
  });

  const [showBookSelection, setShowBookSelection] = useState(false);

  // Data mẫu - sau này sẽ lấy từ API
  const availableBooks = [
    { id: "book1", title: "Sách 1", originalPrice: 100000 },
    { id: "book2", title: "Sách 2", originalPrice: 150000 },
    { id: "book3", title: "Sách 3", originalPrice: 200000 },
  ];

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        startDate: formatDateForInput(event.startDate),
        endDate: formatDateForInput(event.endDate)
      });
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBook = () => {
    if (!bookDiscount.bookId) return;

    const selectedBook = availableBooks.find(book => book.id === bookDiscount.bookId);
    if (!selectedBook) return;

    const newDiscountedBook = {
      id: selectedBook.id,
      title: selectedBook.title,
      originalPrice: selectedBook.originalPrice,
      discountPercent: parseInt(bookDiscount.discountPercent)
    };

    setFormData(prev => ({
      ...prev,
      discountedBooks: [...prev.discountedBooks, newDiscountedBook]
    }));

    setBookDiscount({
      bookId: "",
      discountPercent: 10
    });
  };

  const handleRemoveBook = (bookId) => {
    setFormData(prev => ({
      ...prev,
      discountedBooks: prev.discountedBooks.filter(book => book.id !== bookId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedData = {
      ...formData,
      startDate: formatDateForSubmit(formData.startDate),
      endDate: formatDateForSubmit(formData.endDate)
    };
    onSubmit(submittedData);
  };

  const handleBookSelection = (book) => {
    const newDiscountedBook = {
      id: book.id,
      title: book.title,
      originalPrice: book.originalPrice,
      discountPercent: 10
    };

    setFormData(prev => ({
      ...prev,
      discountedBooks: [...prev.discountedBooks, newDiscountedBook]
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="event-modal">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{event ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}</h2>
              <button className="close-btn" onClick={onClose}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên sự kiện:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày bắt đầu:</label>
                  <CustomDateInput
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ngày kết thúc:</label>
                  <CustomDateInput
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Trạng thái:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Sắp diễn ra">Sắp diễn ra</option>
                  <option value="Đang diễn ra">Đang diễn ra</option>
                  <option value="Đã kết thúc">Đã kết thúc</option>
                </select>
              </div>

              <div className="form-section">
                <h3>Sách giảm giá</h3>
                
                <button 
                  type="button" 
                  className="add-book-btn"
                  onClick={() => setShowBookSelection(true)}
                >
                  Thêm sách giảm giá
                </button>

                <div className="selected-books">
                  {formData.discountedBooks.map(book => (
                    <div key={book.id} className="selected-book-item">
                      <div className="book-cover">
                        <img src={book.coverImage || '/path/to/default-cover.jpg'} alt={book.title} />
                      </div>
                      <div className="book-details">
                        <h4>{book.title}</h4>
                        <div className="price-info">
                          <span className="original-price">
                            {book.originalPrice.toLocaleString('vi-VN')}đ
                          </span>
                          <div className="discount-control">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={book.discountPercent}
                              onChange={(e) => {
                                const newBooks = formData.discountedBooks.map(b => 
                                  b.id === book.id ? {...b, discountPercent: parseInt(e.target.value)} : b
                                );
                                setFormData(prev => ({...prev, discountedBooks: newBooks}));
                              }}
                              className="discount-input"
                            />
                            <span className="percent">%</span>
                          </div>
                        </div>
                        <div className="discounted-price">
                          Giá sau giảm: {(book.originalPrice * (1 - book.discountPercent/100)).toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBook(book.id)}
                        className="remove-btn"
                        title="Xóa sách"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Hủy
                </button>
                <button type="submit" className="submit-btn">
                  {event ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <BookSelectionModal
          isOpen={showBookSelection}
          onClose={() => setShowBookSelection(false)}
          onSelectBook={handleBookSelection}
          selectedBookIds={formData.discountedBooks.map(book => book.id)}
        />
      </div>
    </>
  );
};

export default EventModal; 