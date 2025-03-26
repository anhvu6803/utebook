import { useState, useEffect } from "react";
import "./styles/ManageAudiobookPage.scss";
import SearchIcon from "@mui/icons-material/Search";
import AudiobookDetailForm from "../../components/Admin/AudiobookDetail";
import AdminPasswordModal from "../../components/Admin/AdminPasswordModal";
import AddAudiobookModal from "../../components/Admin/AddNewAudiobookModal";

const audiobooksData = Array.from({ length: 50 }, (_, i) => ({
  title: `Sách nghe ${i + 1}`,
  author: `Tác giả ${i + 1}`,
  genre: i % 2 === 0 ? "Văn học" : "Khoa học",
  price: (i + 1) * 10000,
  cover: `https://via.placeholder.com/150?text=Sách+Nghe+${i + 1}`,
}));

const ManageAudiobookPage = () => {
  const [audiobooks, setAudiobooks] = useState(audiobooksData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAudiobook, setSelectedAudiobook] = useState(null);
  const [audiobookToDelete, setAudiobookToDelete] = useState(null);
  const [showAddAudiobookModal, setShowAddAudiobookModal] = useState(false);
  const audiobooksPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredAudiobooks = audiobooks.filter((audiobook) =>
    audiobook.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAudiobooks.length / audiobooksPerPage);
  const indexOfLastAudiobook = currentPage * audiobooksPerPage;
  const indexOfFirstAudiobook = indexOfLastAudiobook - audiobooksPerPage;
  const currentAudiobooks = filteredAudiobooks.slice(indexOfFirstAudiobook, indexOfLastAudiobook);

  const handleDelete = (audiobook) => {
    setAudiobookToDelete(audiobook);
  };

  const confirmDelete = () => {
    if (audiobookToDelete) {
      setAudiobooks((prevAudiobooks) =>
        prevAudiobooks.filter((b) => b.title !== audiobookToDelete.title)
      );
      setAudiobookToDelete(null);
    }
  };

  const handleAddAudiobook = (newAudiobook) => {
    setAudiobooks((prevAudiobooks) => [newAudiobook, ...prevAudiobooks]);
    setShowAddAudiobookModal(false);
  };

  const handleRowClick = (audiobook) => {
    setSelectedAudiobook(audiobook);
  };

  return (
    <div className="book-management">
      <div className="title">Quản lý sách nghe</div>
      <div className="header-actions">
        <button className="add-book-btn" onClick={() => setShowAddAudiobookModal(true)}>
          + Thêm Sách Nghe Mới
        </button>
        <div className="search-bar">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm sách nghe..."
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
          </tr>
        </thead>
        <tbody>
          {currentAudiobooks.length > 0 ? (
            currentAudiobooks.map((audiobook, index) => (
              <tr 
                key={index} 
                className="clickable-row"
                onClick={() => handleRowClick(audiobook)}
              >
                <td><img className="book-cover" src={audiobook.cover} alt={audiobook.title} /></td>
                <td>{audiobook.title}</td>
                <td>{audiobook.author}</td>
                <td>{audiobook.genre}</td>
                <td>{audiobook.price.toLocaleString()} VND</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-books">Không tìm thấy sách nghe!</td>
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

      {selectedAudiobook && (
        <AudiobookDetailForm 
          audiobook={selectedAudiobook} 
          onClose={() => setSelectedAudiobook(null)}
          onDelete={handleDelete}
        />
      )}

      {audiobookToDelete && (
        <AdminPasswordModal
          onConfirm={confirmDelete}
          onCancel={() => setAudiobookToDelete(null)}
          action="xóa"
          message="Vui lòng nhập mật khẩu admin để xóa sách nghe"
        />
      )}

      {showAddAudiobookModal && (
        <AddAudiobookModal 
          onConfirm={handleAddAudiobook} 
          onCancel={() => setShowAddAudiobookModal(false)} 
        />
      )}
    </div>
  );
};

export default ManageAudiobookPage;
