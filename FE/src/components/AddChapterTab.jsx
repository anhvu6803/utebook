import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles/AddChapterTab.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import BookIcon from "@mui/icons-material/Book";
import TitleIcon from "@mui/icons-material/Title";
import axios from "../utils/axios";
import { useAuth } from "../contexts/AuthContext";
import Loading from "./Loading";
import hoaPhuong from "../assets/hoaPhuong.png";

const AddChapterTab = ({ onConfirm, onCancel }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [newChapter, setNewChapter] = useState({
    chapterName: "",
    price: "",
    pdfFile: null,
    chapterNumber: ""
  });
  const [pdfFileName, setPdfFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [bookSearch, setBookSearch] = useState("");
  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const filteredBooks = books.filter(book => book.bookname.toLowerCase().includes(bookSearch.toLowerCase()));

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showBookDropdown && !event.target.closest('.custom-book-select-wrapper')) {
        setShowBookDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBookDropdown]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/book/books');
      if (response.data.success) {
        setBooks(response.data.data);
      } else {
        setError('Không thể tải danh sách sách');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Không thể tải danh sách sách');
    }
  };

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

  const handleChapterNumberChange = (e) => {
    const number = e.target.value;
    setNewChapter(prev => ({
      ...prev,
      chapterNumber: number,
      chapterName: selectedBook ? 
        `${books.find(book => book._id === selectedBook)?.bookname} - Chương ${number}` : 
        prev.chapterName
    }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewChapter({ ...newChapter, pdfFile: file });
      setPdfFileName(file.name);
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

  const validateFields = () => {
    const errors = {};
    if (!selectedBook) errors.selectedBook = 'Vui lòng chọn sách';
    if (!newChapter.chapterNumber || isNaN(newChapter.chapterNumber)) errors.chapterNumber = 'Vui lòng nhập số chương hợp lệ';
    if (!newChapter.pdfFile) errors.pdfFile = 'Vui lòng tải file nội dung lên';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);
    
    if (!user || !user.email || !user._id) {
      setError("Vui lòng đăng nhập để thực hiện thao tác này");
      setIsLoading(false);
      return;
    }

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    setIsUploading(true);
    try {
      const pdfUrl = await uploadPdfContent(newChapter.pdfFile);
      console.log('PDF uploaded:', pdfUrl);

      const chapterData = {
        chapterName: newChapter.chapterName.trim(),
        price: parseFloat(newChapter.price) || 0,
        viewlink: pdfUrl,
        bookId: selectedBook
      };

      const response = await axios.post('http://localhost:5000/api/chapter/add-chapter', chapterData, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email,
          'x-user-id': user._id,
          'x-is-admin': user.role === 'admin' ? 'true' : 'false'
        },
        withCredentials: true
      });

      if (response.data.success) {
        onConfirm(response.data);
        window.location.href = '/utebook-admin/books?reload=true';
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra khi thêm chapter');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error.message || 'Có lỗi xảy ra khi thêm chapter');
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="add-chapter-tab">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="error-message">
            <span className="error-icon"><DescriptionIcon /></span>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="book-select" className="form-label">Chọn sách <span className="required">*</span></label>
          <div className="custom-book-select-wrapper">
            <div
              className={`custom-book-select-input${fieldErrors.selectedBook ? ' error' : ''}`}
              onClick={() => setShowBookDropdown(true)}
            >
              {selectedBook ? (
                <div className="selected-book-info">
                  <img src={books.find(b => b._id === selectedBook)?.image} alt="cover" className="book-thumb" />
                  <div className="book-meta">
                    <div className="book-title">{books.find(b => b._id === selectedBook)?.bookname}</div>
                    <div className="book-author">{books.find(b => b._id === selectedBook)?.author}</div>
                  </div>
                </div>
              ) : (
                <span className="placeholder">Chọn sách...</span>
              )}
              <span className="dropdown-arrow"><TitleIcon /></span>
            </div>
            {showBookDropdown && (
              <div className="custom-book-dropdown">
                <input
                  type="text"
                  className="book-search-input"
                  placeholder="Tìm kiếm tên sách..."
                  value={bookSearch}
                  onChange={e => setBookSearch(e.target.value)}
                  autoFocus
                />
                <div className="book-list">
                  {filteredBooks.length === 0 ? (
                    <div className="no-books">Không tìm thấy sách</div>
                  ) : (
                    filteredBooks.map(book => (
                      <div
                        key={book._id}
                        className="book-dropdown-item"
                        onClick={() => {
                          setSelectedBook(book._id);
                          setShowBookDropdown(false);
                          setBookSearch("");
                          setNewChapter(prev => ({
                            ...prev,
                            chapterName: `${book.bookname} - Chương ${prev.chapterNumber || ''}`
                          }));
                        }}
                      >
                        <img src={book.image} alt="cover" className="book-thumb" />
                        <div className="book-meta">
                          <div className="book-title">{book.bookname}</div>
                          <div className="book-author">{book.author}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          {fieldErrors.selectedBook && <div className="field-error">{fieldErrors.selectedBook}</div>}
        </div>

        <div className="form-group">
          <div className="input-icon">
            <TitleIcon className="icon" />
            <input
              type="text"
              name="chapterNumber"
              value={newChapter.chapterNumber}
              onChange={handleChapterNumberChange}
              placeholder="Nhập số chương"
              className={`styled-input${fieldErrors.chapterNumber ? ' error' : ''}`}
              disabled={isUploading}
            />
          </div>
          {fieldErrors.chapterNumber && <div className="field-error">{fieldErrors.chapterNumber}</div>}
        </div>

        <div className="form-group">
          <div className="input-icon">
            <TitleIcon className="icon" />
            <input
              type="text"
              name="chapterName"
              value={newChapter.chapterName}
              readOnly
              className="styled-input"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-icon">
            <img src={hoaPhuong} alt="Hoa Phuong" className="icon" style={{ width: '24px', height: '24px' }} />
            <input
              type="number"
              name="price"
              value={newChapter.price}
              onChange={(e) => setNewChapter({ ...newChapter, price: e.target.value })}
              placeholder="Nhập giá chương"
              min="0"
              disabled={isUploading}
              className="styled-input"
            />
          </div>
        </div>

        <div className="pdf-upload-container">
          <input
            type="file"
            id="pdf-upload"
            onChange={handlePdfChange}
            className="file-input"
            disabled={isUploading}
          />
          <label htmlFor="pdf-upload" className="upload-label">
            <div className={`upload-placeholder${fieldErrors.pdfFile ? ' error' : ''}`}>
              <DescriptionIcon className="pdf-icon" />
              <div className="upload-text">
                <span className="main-text">{pdfFileName || "Tải file nội dung lên"}</span>
                <span className="sub-text">Chọn hoặc kéo thả file nội dung vào đây</span>
              </div>
              <CloudUploadIcon className="upload-icon" />
            </div>
          </label>
          {fieldErrors.pdfFile && <div className="field-error">{fieldErrors.pdfFile}</div>}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="confirm-btn"
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="loading-text">
                <span className="loading-dots">...</span>
                Đang tải lên
              </span>
            ) : (
              'Thêm chương'
            )}
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
  );
};

AddChapterTab.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddChapterTab; 