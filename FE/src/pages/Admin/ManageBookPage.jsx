import { useState, useEffect } from "react";
import "./styles/ManageBookPage.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import BookDetailForm from "../../components/Admin/BookDetail";
import AdminPasswordModal from "../../components/Admin/AdminPasswordModal";
import AddBookModal from "../../components/AddNewBookModal";
import axios from "axios";

const ManageBookPage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const booksPerPage = 10;

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/book/books");
      if (response.data.success) {
        setBooks(response.data.data);
      } else {
        setError("Không thể lấy danh sách sách");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải danh sách sách");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/category");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchBookDetail = async (bookId) => {
    try {
      setDetailLoading(true);
      const response = await axios.get(`http://localhost:5000/api/book/books/${bookId}`);
      if (response.data.success) {
        setSelectedBook(response.data.data);
      } else {
        setError("Không thể lấy thông tin sách");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải thông tin sách");
      console.error("Error fetching book detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredBooks = books.filter((book) =>
    book.bookname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handleDelete = (book) => {
    setBookToDelete(book);
  };

  const confirmDelete = async (password) => {
    try {
      if (bookToDelete) {
        await axios.delete(`http://localhost:5000/api/book/books/${bookToDelete._id}`, {
          withCredentials: true
        });
        setBooks((prevBooks) => prevBooks.filter((b) => b._id !== bookToDelete._id));
        setBookToDelete(null);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi xóa sách');
    }
  };

  const handleAddBook = (newBook) => {
    setBooks((prevBooks) => [newBook, ...prevBooks]);
    setShowAddBookModal(false);
  };

  const handleRowClick = async (book) => {
    await fetchBookDetail(book._id);
  };

  if (loading) {
    return <div className="book-management loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="book-management error">{error}</div>;
  }

  return (
    <div className="book-management">
      <div className="title">Quản lý sách</div>
      <div className="header-actions">
        <button className="add-book-btn" onClick={() => setShowAddBookModal(true)}>
          + Thêm Sách Mới
        </button>
        <div className="search-bar">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>  
      <table>
        <thead>
          <tr>
            <th>Bìa</th>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Thể loại</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
              <tr 
                key={book._id} 
                className="clickable-row"
                onClick={() => handleRowClick(book)}
              >
                <td><img className="book-cover" src={book.image} alt={book.bookname} /></td>
                <td>{book.bookname}</td>
                <td>{book.author}</td>
                <td>{book.categories.join(", ")}</td>
                <td>{book.description}</td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(book);
                    }}
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-books">Không tìm thấy sách!</td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Trước
          </button>
          <span>Trang {currentPage} / {totalPages}</span>
          <button className="pagination-btn" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Tiếp
          </button>
        </div>
      )}

      {selectedBook && (
        <BookDetailForm 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
          loading={detailLoading}
          categories={categories}
        />
      )}

      {bookToDelete && (
        <AdminPasswordModal
          onConfirm={confirmDelete}
          onCancel={() => setBookToDelete(null)}
          action="xóa"
          message="Vui lòng nhập mật khẩu admin để xóa sách"
        />
      )}

      {showAddBookModal && (
        <AddBookModal onConfirm={handleAddBook} onCancel={() => setShowAddBookModal(false)} />
      )}
    </div>
  );
};

export default ManageBookPage;
