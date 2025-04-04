import { useState } from "react";
import PropTypes from "prop-types";
import "./styles/AddNewBookModal.scss";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const AddBookModal = ({ onConfirm, onCancel }) => {
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "Văn học",
    price: "",
    cover: null,
    content: null,
    publisher: "",
    publishYear: "",
    description: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? 
      (e.target.value === '' ? '' : Number(e.target.value)) : 
      e.target.value;
    setNewBook({ ...newBook, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBook({ ...newBook, cover: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBook({ ...newBook, content: file });
      setPdfFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.price || !newBook.cover || !newBook.content) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }
    onConfirm(newBook);
  };

  return (
    <div className="add-book-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Thêm Sách Mới</h2>
            <button className="close-btn" onClick={onCancel}>
              <CloseIcon />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-layout">
              <div className="upload-section">
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="cover-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <label htmlFor="cover-upload" className="upload-label">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="preview-image" />
                    ) : (
                      <div className="upload-placeholder">
                        <CloudUploadIcon />
                        <span>Tải ảnh bìa lên</span>
                        <span className="sub-text">Chọn hoặc kéo thả file ảnh vào đây</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="pdf-upload-container">
                  <input
                    type="file"
                    id="pdf-upload"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="file-input"
                  />
                  <label htmlFor="pdf-upload" className="upload-label">
                    <div className="upload-placeholder">
                      <PictureAsPdfIcon />
                      <span>{pdfFileName || "Tải nội dung PDF lên"}</span>
                      <span className="sub-text">Chọn hoặc kéo thả file PDF vào đây</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-fields">
                <div className="form-group">
                  <label>Tiêu đề <span className="required">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={newBook.title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề sách"
                  />
                </div>

                <div className="form-group">
                  <label>Tác giả <span className="required">*</span></label>
                  <input
                    type="text"
                    name="author"
                    value={newBook.author}
                    onChange={handleChange}
                    placeholder="Nhập tên tác giả"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Thể loại <span className="required">*</span></label>
                    <select name="genre" value={newBook.genre} onChange={handleChange}>
                      <option value="Văn học">Văn học</option>
                      <option value="Khoa học">Khoa học</option>
                      <option value="Kinh tế">Kinh tế</option>
                      <option value="Tâm lý">Tâm lý</option>
                      <option value="Thiếu nhi">Thiếu nhi</option>
                      <option value="Ngoại ngữ">Ngoại ngữ</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Giá (VND) <span className="required">*</span></label>
                    <input
                      type="number"
                      name="price"
                      value={newBook.price}
                      onChange={handleChange}
                      placeholder="Nhập giá sách"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nhà xuất bản</label>
                    <input
                      type="text"
                      name="publisher"
                      value={newBook.publisher}
                      onChange={handleChange}
                      placeholder="Nhập tên NXB"
                    />
                  </div>

                  <div className="form-group">
                    <label>Năm xuất bản</label>
                    <input
                      type="number"
                      name="publishYear"
                      value={newBook.publishYear}
                      onChange={handleChange}
                      placeholder="Nhập năm xuất bản"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    value={newBook.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả sách"
                    rows="4"
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="confirm-btn">
                Thêm sách
              </button>
              <button type="button" className="cancel-btn" onClick={onCancel}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddBookModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddBookModal;
