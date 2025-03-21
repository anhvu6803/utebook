import { useState } from "react";
import "./styles/ManageBookPage.scss";
import DeleteIcon from "@mui/icons-material/Delete";;
import SearchIcon from "@mui/icons-material/Search";
import BookDetailForm from "../../components/Admin/BookDetail";
import AdminPasswordModal from "../../components/Admin/AdminPasswordModal";
import AddBookModal from "../../components/AddNewBookModal";

const booksData = Array.from({ length: 50 }, (_, i) => ({
  title: `Sách ${i + 1}`,
  author: `Tác giả ${i + 1}`,
  genre: i % 2 === 0 ? "Văn học" : "Khoa học",
  price: (i + 1) * 10000,
  cover: `https://via.placeholder.com/150?text=Sách+${i + 1}`,
}));

const ManageBookPage = () => {
  const [books, setBooks] = useState(booksData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const booksPerPage = 10;

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handleDelete = (book) => {
    setBookToDelete(book);
  };

  const confirmDelete = () => {
    if (bookToDelete) {
      setBooks((prevBooks) => prevBooks.filter((b) => b.title !== bookToDelete.title));
      setBookToDelete(null);
    }
  };

  const handleAddBook = (newBook) => {
    setBooks((prevBooks) => [newBook, ...prevBooks]);
    setShowAddBookModal(false);
  };

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
            <th>Giá</th>
            <th>Xóa sách</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.length > 0 ? (
            currentBooks.map((book, index) => (
              <tr key={index} className="clickable-row">
                <td><img className="book-cover" src={book.cover} alt={book.title} /></td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.price.toLocaleString()} VND</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(book)}>
                    <DeleteIcon fontSize="small" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-books">Không tìm thấy sách!</td>
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
        <BookDetailForm book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

      {bookToDelete && (
        <AdminPasswordModal
          user={{ fullname: bookToDelete.title }}
          action="delete"
          onConfirm={confirmDelete}
          onCancel={() => setBookToDelete(null)}
        />
      )}

      {showAddBookModal && (
        <AddBookModal onConfirm={handleAddBook} onCancel={() => setShowAddBookModal(false)} />
      )}
    </div>
  );
};

export default ManageBookPage;
