import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import "./styles/AddNewBookModal.scss";

const AddBookModal = ({ onConfirm, onCancel }) => {
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "Văn học",
    price: "",
    cover: "",
  });

  const handleChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!newBook.title || !newBook.author || !newBook.price || !newBook.cover) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    onConfirm({ ...newBook, price: parseInt(newBook.price, 10) });
  };

  return (
    <div className="add-book-modal">
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Thêm Sách Mới</h2>
        <input type="text" name="title" placeholder="Tiêu đề" onChange={handleChange} />
        <input type="text" name="author" placeholder="Tác giả" onChange={handleChange} />
        <select name="genre" onChange={handleChange}>
          <option value="Văn học">Văn học</option>
          <option value="Khoa học">Khoa học</option>
        </select>
        <input type="number" name="price" placeholder="Giá (VND)" onChange={handleChange} />
        <input type="text" name="cover" placeholder="URL ảnh bìa" onChange={handleChange} />

        <div className="modal-actions">
          <button className="confirm-btn" onClick={handleSubmit}>Thêm</button>
          <button className="cancel-btn" onClick={onCancel}>Hủy</button>
        </div>
      </div>
    </div>
    </div>
  );
};

// **Thêm PropTypes để kiểm tra kiểu dữ liệu**
AddBookModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddBookModal;
