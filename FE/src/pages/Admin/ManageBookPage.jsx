import { useState, useEffect } from "react";
import "./styles/ManageBookPage.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import BookDetailForm from "../../components/Admin/BookDetail";
import AdminPasswordModal from "../../components/Admin/AdminPasswordModal";
import AddBookModal from "../../components/AddNewBookModal";
import axios from "axios";

const ManageBookPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  const filteredBooks = books.filter((book) => {
    const matchesSearch = searchTerm
      ? book.bookname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory = searchCategory
      ? book.categories.some(cat => cat.toLowerCase().includes(searchCategory.toLowerCase()))
      : true;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(Math.ceil(filteredBooks.length / pageSize));
  }, [searchTerm, searchCategory, filteredBooks.length, pageSize]);

  const indexOfLastBook = currentPage * pageSize;
  const indexOfFirstBook = indexOfLastBook - pageSize;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handleDelete = (book) => {
    setBookToDelete(book);
  };

  const confirmDelete = async () => {
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
        <button
            className="add-book-btn"
            onClick={() => setShowAddBookModal(true)}
          >
            + Thêm Sách Mới
          </button>
          <div className="search-fields-group">
            <div className="search-bar">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Nhập tên sách hoặc tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="search-bar-category">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="category-select"
              >
                <option value="">Tất cả thể loại</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          
      </div>
      <table>
        <thead>
          <tr>
            <th>Bìa</th>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Thể loại</th>
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
