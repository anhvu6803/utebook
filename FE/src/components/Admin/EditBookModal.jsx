import { useState } from "react";
import PropTypes from "prop-types";
import "./styles/EditBookModal.scss";

const EditBookModal = ({ book, onSave, onCancel }) => {
  const [editedBook, setEditedBook] = useState(
    book || { title: "", author: "", read: false }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBook({ ...editedBook, [name]: value });
  };

  const handleSave = () => {
    onSave(editedBook);
  };

  return (
    <div className="edit-book-modal">
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-content">
        <h2>{book ? "Chỉnh sửa sách" : "Thêm sách mới"}</h2>

        <div className="input-group">
          <label>Tên sách:</label>
          <input type="text" name="title" value={editedBook.title} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Tác giả:</label>
          <input type="text" name="author" value={editedBook.author} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Trạng thái:</label>
          <select name="read" value={editedBook.read ? "true" : "false"} onChange={(e) => setEditedBook({ ...editedBook, read: e.target.value === "true" })}>
            <option value="false">Chưa đọc</option>
            <option value="true">Đã đọc</option>
          </select>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          <button className="save-btn" onClick={handleSave}>Lưu</button>
        </div>
      </div>
    </div>
  );
};

EditBookModal.propTypes = {
  book: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditBookModal;
