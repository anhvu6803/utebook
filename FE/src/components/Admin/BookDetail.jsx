import PropTypes from "prop-types";
import "./styles/BookDetail.scss";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useState } from "react";
import AdminPasswordModal from "./AdminPasswordModal";

const BookDetail = ({ book, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [editedBook, setEditedBook] = useState({ ...book });
  const [originalBook, setOriginalBook] = useState({ ...book });

  const handleEdit = () => {
    setActionType('edit');
    setShowAdminModal(true);
  };

  const handleDelete = () => {
    setActionType('delete');
    setShowAdminModal(true);
  };

  const handleRead = () => {
    // Thêm logic để mở modal đọc sách hoặc chuyển đến trang đọc sách
    console.log("Mở nội dung sách:", book.title);
  };

  const handleAdminConfirm = () => {
    if (actionType === 'edit') {
      setIsEditing(true);
    } else if (actionType === 'delete') {
      onDelete(book);
      onClose();
    }
    setShowAdminModal(false);
  };

  const handleSave = () => {
    onUpdate(editedBook);
    setOriginalBook({ ...editedBook });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBook({ ...originalBook });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBook(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  if (!book) return null;

  return (
    <div className="book-detail-overlay">
      <div className="book-detail-modal">
        <button className="close-btn" onClick={onClose}>
          <CloseIcon />
        </button>
        
        <div className="book-content">
          <div className="book-image-section">
            <img src={book.cover} alt={book.title} className="book-cover" />
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
              <label>Tiêu đề:</label>
              <input
                type="text"
                name="title"
                value={editedBook.title}
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
              <input
                type="text"
                name="genre"
                value={editedBook.genre}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
              />
            </div>

            <div className="info-group">
              <label>Giá:</label>
              <input
                type="number"
                name="price"
                value={editedBook.price}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
              />
            </div>

            <div className="info-group">
              <label>Mô tả:</label>
              <textarea
                name="description"
                value={editedBook.description || "Chưa có mô tả"}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
                rows={4}
              />
            </div>
          </div>
        </div>
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
    description: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default BookDetail;
