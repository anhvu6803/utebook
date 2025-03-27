import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "./styles/EditEventModal.scss";
import CustomDateInput from './CustomDateInput';

const EditEventModal = ({ isOpen, onClose, onSubmit, event }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    discountedBooks: []
  });

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

  const handleUpdateBookDiscount = (bookId, newDiscount) => {
    setFormData(prev => ({
      ...prev,
      discountedBooks: prev.discountedBooks.map(book => 
        book.id === bookId 
          ? { ...book, discountPercent: parseInt(newDiscount) }
          : book
      )
    }));
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

  if (!isOpen || !event) return null;

  return (
    <div className="edit-event-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Chỉnh sửa sự kiện</h2>
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
              <h3>Sách đang giảm giá</h3>
              <div className="books-list">
                {formData.discountedBooks.map(book => (
                  <div key={book.id} className="book-item">
                    <div className="book-info">
                      <img src={book.image} alt={book.title} className="book-image" />
                      <span className="book-title">{book.title}</span>
                    </div>
                    <div className="discount-control">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={book.discountPercent}
                        onChange={(e) => handleUpdateBookDiscount(book.id, e.target.value)}
                      />
                      <span>%</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBook(book.id)}
                        className="remove-btn"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="submit-btn">
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal; 