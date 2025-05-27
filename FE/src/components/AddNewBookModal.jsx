import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles/AddNewBookModal.scss";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CategoryIcon from "@mui/icons-material/Category";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Loading from "./Loading";
import AddChapterTab from "./AddChapterTab";

const AddBookModal = ({ onConfirm, onCancel }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('book'); // 'book' or 'chapter'
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    bookname: "",
    author: "",
    categories: [],
    price: "",
    type: "Free",
    pushlisher: "",
    description: "",
    cover: null,
    ageLimit: 0
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedCategories.includes(category.name)
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsSelectOpen(true);
  };

  const handleCategorySelect = (categoryName) => {
    if (categoryName && !selectedCategories.includes(categoryName)) {
      const newSelectedCategories = [...selectedCategories, categoryName];
      setSelectedCategories(newSelectedCategories);
      setNewBook({ ...newBook, categories: newSelectedCategories });
      setSearchTerm('');
      setIsSelectOpen(false);
    }
  };

  const removeCategory = (categoryName) => {
    const newSelectedCategories = selectedCategories.filter(name => name !== categoryName);
    setSelectedCategories(newSelectedCategories);
    setNewBook({ ...newBook, categories: newSelectedCategories });
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

  const addBook = async (bookData) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      };

      const response = await axios.post('http://localhost:5000/api/book/add-book', bookData, {
        headers,
        withCredentials: true
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Lỗi khi thêm sách');
      }

      return response.data;
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (!user || !user.email || !user._id) {
      setError("Vui lòng đăng nhập để thực hiện thao tác này");
      setIsLoading(false);
      return;
    }

    if (!newBook.bookname || !newBook.author || !newBook.cover) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      setIsLoading(false);
      return;
    }

    if (newBook.type === "Có phí" && (!newBook.price || newBook.price <= 0)) {
      setError("Vui lòng nhập giá hợp lệ cho sách có phí!");
      setIsLoading(false);
      return;
    }

    if (newBook.ageLimit === undefined || newBook.ageLimit === null) {
      setError("Vui lòng nhập giới hạn độ tuổi!");
      setIsLoading(false);
      return;
    }

    setIsUploading(true);
    try {
      // Upload cover image to Cloudinary
      const coverImageUrl = await uploadCoverImage(newBook.cover);
      console.log('Cover image uploaded:', coverImageUrl);
      
      // Prepare book data
      const bookData = {
        bookname: newBook.bookname.trim(),
        author: newBook.author.trim(),
        categories: Array.isArray(newBook.categories) ? newBook.categories : [newBook.categories],
        price: newBook.type === "Có phí" ? parseFloat(newBook.price) : 0,
        type: newBook.type,
        pushlisher: newBook.pushlisher.trim(),
        description: newBook.description.trim(),
        image: coverImageUrl,
        ageLimit: parseInt(newBook.ageLimit)
      };

      console.log('Sending book data:', bookData);

      // Add book to database
      const response = await addBook(bookData);

      if (response.success) {
        // Call the onConfirm callback with the book data
        onConfirm(response.data.book);
        
        // Redirect to books page and force reload
        window.location.href = '/utebook-admin/books?reload=true';
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra khi thêm sách');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error.message || 'Có lỗi xảy ra khi thêm sách');
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/category');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="add-book-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{activeTab === 'book' ? 'Thêm Sách Mới' : 'Thêm Chương Mới'}</h2>
            <button className="close-btn" onClick={onCancel}>
              <CloseIcon />
            </button>
          </div>

          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'book' ? 'active' : ''}`}
              onClick={() => setActiveTab('book')}
            >
              Thêm Sách
            </button>
            <button 
              className={`tab-button ${activeTab === 'chapter' ? 'active' : ''}`}
              onClick={() => setActiveTab('chapter')}
            >
              Thêm Chương
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {activeTab === 'book' ? (
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

                  <div className="form-group">
                    <label>Thể loại <span className="required">*</span></label>
                    <div className="category-select-container">
                      <div className="category-search-wrapper">
                        <div className="search-input-container">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setIsSelectOpen(true)}
                            placeholder="Tìm kiếm thể loại..."
                            className="category-search-input"
                            disabled={isUploading}
                          />
                        </div>
                        {isSelectOpen && (
                          <div className="category-dropdown">
                            {filteredCategories.length > 0 ? (
                              filteredCategories.map((category) => (
                                <div
                                  key={category.name}
                                  className="category-option"
                                  onClick={() => handleCategorySelect(category.name)}
                                >
                                  <div className="category-icon">
                                    <CategoryIcon />
                                  </div>
                                  {category.name}
                                </div>
                              ))
                            ) : (
                              <div className="category-dropdown-empty">
                                <SentimentDissatisfiedIcon className="empty-icon" />
                                <span>Không tìm thấy thể loại phù hợp</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="selected-categories">
                        {selectedCategories.map((categoryName) => (
                          <div key={categoryName} className="category-tag">
                            {categoryName}
                            <button 
                              type="button" 
                              onClick={() => removeCategory(categoryName)}
                              className="remove-category"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Đối tượng <span className="required">*</span></label>
                      <select 
                        name="type" 
                        value={newBook.type} 
                        onChange={handleChange}
                        disabled={isUploading}
                      >
                        <option value="Free">Tất cả</option>
                        <option value="Member">Hội viên</option>
                        <option value="HoaPhuong">Có phí</option>
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

                    <div className="form-group">
                      <label>Giới hạn tuổi <span className="required">*</span></label>
                      <input
                        type="number"
                        name="ageLimit"
                        value={newBook.ageLimit}
                        onChange={handleChange}
                        placeholder="Nhập giới hạn tuổi"
                        min="0"
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
          ) : (
            <AddChapterTab 
              onConfirm={onConfirm}
              onCancel={onCancel}
            />
          )}
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
