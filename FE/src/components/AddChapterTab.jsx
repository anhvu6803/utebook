import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles/AddChapterTab.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import BookIcon from "@mui/icons-material/Book";
import TitleIcon from "@mui/icons-material/Title";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Loading from "./Loading";

const AddChapterTab = ({ onConfirm, onCancel }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [newChapter, setNewChapter] = useState({
    chapterName: "",
    price: "",
    pdfFile: null
  });
  const [pdfFileName, setPdfFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

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

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? 
      (e.target.value === '' ? '' : Number(e.target.value)) : 
      e.target.value;
    setNewChapter({ ...newChapter, [e.target.name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (!user || !user.email || !user._id) {
      setError("Vui lòng đăng nhập để thực hiện thao tác này");
      setIsLoading(false);
      return;
    }

    if (!selectedBook || !newChapter.chapterName || !newChapter.pdfFile) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc!");
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
          ...getAuthHeaders()
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
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="form-group">
          <div className="input-icon">
            <BookIcon className="icon" />
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              disabled={isUploading}
              className="styled-select"
            >
              <option value="">Chọn sách</option>
              {books.map(book => (
                <option key={book._id} value={book._id}>
                  {book.bookname}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="input-icon">
            <TitleIcon className="icon" />
            <input
              type="text"
              name="chapterName"
              value={newChapter.chapterName}
              onChange={handleChange}
              placeholder="Nhập tên chương"
              disabled={isUploading}
              className="styled-input"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-icon">
            <AttachMoneyIcon className="icon" />
            <input
              type="number"
              name="price"
              value={newChapter.price}
              onChange={handleChange}
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
            accept=".pdf"
            onChange={handlePdfChange}
            className="file-input"
            disabled={isUploading}
          />
          <label htmlFor="pdf-upload" className="upload-label">
            <div className="upload-placeholder">
              <PictureAsPdfIcon className="pdf-icon" />
              <div className="upload-text">
                <span className="main-text">{pdfFileName || "Tải nội dung PDF lên"}</span>
                <span className="sub-text">Chọn hoặc kéo thả file PDF vào đây</span>
              </div>
              <CloudUploadIcon className="upload-icon" />
            </div>
          </label>
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