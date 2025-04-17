import { useState } from "react";
import PropTypes from "prop-types";
import "./styles/AddNewBookModal.scss";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const AddBookModal = ({ onConfirm, onCancel }) => {
  const { user, email, userId, isAdmin } = useAuth();
  console.log('Auth context in AddNewBookModal:', { user, email, userId, isAdmin });

  const [newBook, setNewBook] = useState({
    bookname: "",
    author: "",
    categories: ["Văn học"],
    price: "",
    type: "Tất cả",
    pushlisher: "",
    description: "",
    cover: null,
    content: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    if (!user || !user.email || !user._id) {
      setError("Vui lòng đăng nhập để thực hiện thao tác này");
      throw new Error("Vui lòng đăng nhập để thực hiện thao tác này");
    }
    return {
      'x-user-email': user.email,
      'x-user-id': user._id,
      'x-is-admin': user.role === 'admin'
    };
  };

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

  const uploadCoverImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const headers = {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders()
      };

      const response = await axios.post('http://localhost:5000/api/cloudinary/upload', formData, {
        headers,
        withCredentials: true
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Lỗi khi tải ảnh bìa lên');
      }

      return response.data.data.url;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi tải ảnh bìa lên');
    }
  };

  const uploadPdfContent = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const headers = {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders()
      };

      const response = await axios.post('http://localhost:5000/api/drive/upload', formData, {
        headers,
        withCredentials: true
      });
      return response.data.file.viewLink;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw new Error('Lỗi khi tải PDF lên');
    }
  };

  const addBook = async (bookData) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      };

      console.log('Sending book data:', bookData);
      console.log('Headers:', headers);

      const response = await axios.post('http://localhost:5000/api/book/add-book', bookData, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error adding book:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw new Error(error.response?.data?.message || 'Lỗi khi thêm sách');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    
    if (!user || !user.email || !user._id) {
      setError("Vui lòng đăng nhập để thực hiện thao tác này");
      return;
    }

    if (!newBook.bookname || !newBook.author || !newBook.cover || !newBook.content) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }
    if (newBook.type === "Có phí" && (!newBook.price || newBook.price <= 0)) {
      setError("Vui lòng nhập giá hợp lệ cho sách có phí!");
      return;
    }

    setIsUploading(true);
    try {
      // Upload cover image to Cloudinary
      const coverImageUrl = await uploadCoverImage(newBook.cover);
      console.log('Cover image uploaded:', coverImageUrl);
      
      // Upload PDF to Google Drive
      const pdfUrl = await uploadPdfContent(newBook.content);
      console.log('PDF uploaded:', pdfUrl);

      // Prepare book data with URLs
      const bookData = {
        bookname: newBook.bookname.trim(),
        author: newBook.author.trim(),
        categories: Array.isArray(newBook.categories) ? newBook.categories : [newBook.categories],
        price: newBook.type === "Có phí" ? parseFloat(newBook.price) : 0,
        type: newBook.type,
        pushlisher: newBook.pushlisher.trim(),
        description: newBook.description.trim(),
        image: coverImageUrl,
        viewlink: pdfUrl
      };

      console.log('Final book data:', bookData);

      // Add book to database
      await addBook(bookData);

      // Call the onConfirm callback
      onConfirm(bookData);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error.message || 'Có lỗi xảy ra khi thêm sách');
    } finally {
      setIsUploading(false);
    }
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
                    disabled={isUploading}
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
                    disabled={isUploading}
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
                  <label>Tên sách <span className="required">*</span></label>
                  <input
                    type="text"
                    name="bookname"
                    value={newBook.bookname}
                    onChange={handleChange}
                    placeholder="Nhập tên sách"
                    disabled={isUploading}
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
                    disabled={isUploading}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Thể loại <span className="required">*</span></label>
                    <select 
                      name="categories" 
                      value={newBook.categories[0]} 
                      onChange={handleChange}
                      disabled={isUploading}
                    >
                      <option value="Văn học">Văn học</option>
                      <option value="Khoa học">Khoa học</option>
                      <option value="Kinh tế">Kinh tế</option>
                      <option value="Tâm lý">Tâm lý</option>
                      <option value="Thiếu nhi">Thiếu nhi</option>
                      <option value="Ngoại ngữ">Ngoại ngữ</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Đối tượng <span className="required">*</span></label>
                    <select 
                      name="type" 
                      value={newBook.type} 
                      onChange={handleChange}
                      disabled={isUploading}
                    >
                      <option value="Tất cả">Tất cả</option>
                      <option value="Hội viên">Hội viên</option>
                      <option value="Có phí">Có phí</option>
                    </select>
                  </div>
                </div>

                {newBook.type === "Có phí" && (
                  <div className="form-group">
                    <label>Giá (VND) <span className="required">*</span></label>
                    <input
                      type="number"
                      name="price"
                      value={newBook.price}
                      onChange={handleChange}
                      placeholder="Nhập giá sách"
                      min="0"
                      disabled={isUploading}
                    />
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Nhà xuất bản</label>
                    <input
                      type="text"
                      name="pushlisher"
                      value={newBook.pushlisher}
                      onChange={handleChange}
                      placeholder="Nhập tên NXB"
                      disabled={isUploading}
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
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                type="submit" 
                className="confirm-btn"
                disabled={isUploading}
              >
                {isUploading ? 'Đang tải lên...' : 'Thêm sách'}
              </button>
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={onCancel}
                disabled={isUploading}
              >
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
