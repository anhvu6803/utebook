import { useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import './styles/BookSelectionModal.scss';

const BookSelectionModal = ({ isOpen, onClose, onSelectBook, selectedBookIds }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data mẫu - sau này sẽ lấy từ API
  const books = [
    {
      id: "book1",
      title: "Sách 1",
      author: "Tác giả 1",
      originalPrice: 100000,
      coverImage: "/path/to/image1.jpg",
      publisher: "NXB Kim Đồng"
    },
    {
      id: "book2",
      title: "Sách 2",
      author: "Tác giả 2",
      originalPrice: 150000,
      coverImage: "/path/to/image2.jpg",
      publisher: "NXB Trẻ"
    },
    // Thêm sách mẫu...
  ];

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectBook = (book) => {
    onSelectBook(book);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="book-selection-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Chọn sách giảm giá</h2>
            <button className="close-btn" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="search-bar">
            <SearchIcon />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="books-grid">
            {filteredBooks.map(book => (
              <div 
                key={book.id} 
                className={`book-card ${selectedBookIds.includes(book.id) ? 'selected' : ''}`}
                onClick={() => handleSelectBook(book)}
              >
                <div className="book-image">
                  <img src={book.coverImage} alt={book.title} />
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="author">{book.author}</p>
                  <p className="publisher">{book.publisher}</p>
                  <p className="price">
                    {book.originalPrice.toLocaleString('vi-VN')}đ
                  </p>
                </div>
                {selectedBookIds.includes(book.id) && (
                  <div className="selected-overlay">
                    <span>Đã chọn</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSelectionModal; 