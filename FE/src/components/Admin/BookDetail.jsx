import PropTypes from "prop-types";
import "./styles/BookDetail.scss";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useState, useEffect } from "react";
import AdminPasswordModal from "./AdminPasswordModal";
import axios from "axios";
import ChapterManagementModal from './ChapterManagementModal';

const BookDetail = ({ book, onClose, loading, categories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [editedBook, setEditedBook] = useState({ ...book });
  const [originalBook, setOriginalBook] = useState({ ...book });
  const [error, setError] = useState(null);
  const [showChapterModal, setShowChapterModal] = useState(false);

  useEffect(() => {
    setEditedBook({ ...book });
    setOriginalBook({ ...book });
  }, [book]);

  const handleEdit = () => {
    setActionType('edit');
    setShowAdminModal(true);
  };

  const handleDelete = () => {
    setActionType('delete');
    setShowAdminModal(true);
  };

  const handleRead = async () => {
    try {
      // First get the book's chapters to find the first chapter ID
      const bookResponse = await axios.get(`http://localhost:5000/api/book/books/${book._id}`, {
        withCredentials: true
      });

      if (bookResponse.data.success && bookResponse.data.data.chapterIds && bookResponse.data.data.chapterIds.length > 0) {
        const firstChapterId = bookResponse.data.data.chapterIds[0];
        
        // Then get the chapter details using the chapter ID
        const chapterResponse = await axios.get(`http://localhost:5000/api/chapter/chapter/${firstChapterId}`, {
          withCredentials: true
        });

        if (chapterResponse.data.success && chapterResponse.data.data.viewlink) {
          window.open(chapterResponse.data.data.viewlink, '_blank');
        } else {
          console.error('No viewlink found in the chapter');
        }
      } else {
        console.error('No chapters found for this book');
      }
    } catch (error) {
      console.error('Error fetching chapter:', error);
      if (error.response?.data?.message) {
        console.error('Server error:', error.response.data.message);
      }
    }
  };

  const handleAdminConfirm = async () => {
    try {
      if (actionType === 'edit') {
        setIsEditing(true);
      } else if (actionType === 'delete') {
        await handleDeleteBook();
      }
      setShowAdminModal(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteBook = async () => {
    await axios.delete(`http://localhost:5000/api/book/books/${book._id}`, {
      withCredentials: true
    });
    onClose();
    window.location.reload(); // Reload page to update book list
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/book/books/${book._id}`, editedBook, {
        withCredentials: true
      });
      if (response.data.success) {
        setOriginalBook({ ...editedBook });
        setIsEditing(false);
        window.location.reload(); // Reload page to update book list
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sách');
    }
  };

  const handleCancel = () => {
    setEditedBook({ ...originalBook });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBook(prev => ({
      ...prev,
      [name]: name === 'ageLimit' ? Number(value) : value
    }));
  };

  if (!book) return null;

  return (
    <div className="book-detail-overlay">
      <div className="book-detail-modal">
        <button className="close-btn" onClick={onClose}>
          <CloseIcon />
        </button>
        
        {loading ? (
          <div className="loading">Đang tải thông tin sách...</div>
        ) : (
          <div className="book-content">
            {error && <div className="error-message">{error}</div>}
            <div className="book-image-section">
              <img src={book.image} alt={book.bookname} className="book-cover" />
              <div className="action-buttons">
                {!isEditing ? (
                  <>
                    <button className="read-btn" onClick={handleRead}>
                      <MenuBookIcon />
                      Đọc sách
                    </button>
                    <button className="edit-btn" onClick={handleEdit}>
                      <EditIcon />
                      Sửa
                    </button>
                    <button className="delete-btn" onClick={handleDelete}>
                      <DeleteIcon />
                      Xóa
                    </button>
                  </>
                ) : (
                  <>
                    <button className="save-btn" onClick={handleSave}>
                      <SaveIcon />
                      Lưu
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      <CancelIcon />
                      Hủy
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="book-info">
              <div className="info-group">
                <label>Tên sách:</label>
                <input
                  type="text"
                  name="bookname"
                  value={editedBook.bookname}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>

              <div className="info-group">
                <label>Tác giả:</label>
                <input
                  type="text"
                  name="author"
                  value={editedBook.author}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>

              <div className="info-group">
                <label>Thể loại:</label>
                <div className="category-tags">
                  {editedBook.categories.map((category) => (
                    <div key={category} className="category-tag">
                      {category}
                      {isEditing && (
                        <button
                          type="button"
                          className="remove-tag"
                          onClick={() => {
                            setEditedBook(prev => ({
                              ...prev,
                              categories: prev.categories.filter(cat => cat !== category)
                            }));
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <select
                      value=""
                      onChange={(e) => {
                        const newCategory = e.target.value;
                        if (newCategory && !editedBook.categories.includes(newCategory)) {
                          setEditedBook(prev => ({
                            ...prev,
                            categories: [...prev.categories, newCategory]
                          }));
                        }
                      }}
                      className="category-select"
                    >
                      <option value="">Thêm thể loại...</option>
                      {categories
                        .filter(category => !editedBook.categories.includes(category.name))
                        .map(category => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="info-group">
                <label>Loại sách:</label>
                <select
                  name="type"
                  value={editedBook.type}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                >
                  <option value="Free">Miễn phí</option>
                  <option value="Member">Thành viên</option>
                  <option value="HoaPhuong">Hoa Phượng</option>
                </select>
              </div>

              <div className="info-group">
                <label>Nhà xuất bản:</label>
                <input
                  type="text"
                  name="pushlisher"
                  value={editedBook.pushlisher}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>

              <div className="info-group">
                <label>Độ tuổi:</label>
                <input
                  type="number"
                  name="ageLimit"
                  value={editedBook.ageLimit}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>

              <div className="info-group">
                <label>Mô tả:</label>
                <textarea
                  name="description"
                  value={editedBook.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {showAdminModal && (
        <AdminPasswordModal
          onClose={() => setShowAdminModal(false)}
          isOpen={showAdminModal}
          onConfirm={handleAdminConfirm}
          onCancel={() => setShowAdminModal(false)}
          action={actionType === 'edit' ? 'sửa' : 'xóa'}
          message={`Vui lòng nhập mật khẩu admin để ${
            actionType === 'edit' ? 'sửa' : 'xóa'
          } sách`}
        />
      )}

      {showChapterModal && (
        <ChapterManagementModal
          bookId={book._id}
          onClose={() => setShowChapterModal(false)}
        />
      )}
    </div>
  );
};

BookDetail.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    bookname: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired,
    pushlisher: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    ageLimit: PropTypes.number.isRequired,
    viewLink: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  categories: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired
};

export default BookDetail;
