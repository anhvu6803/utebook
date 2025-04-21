import PropTypes from "prop-types";
import "./styles/ChapterManagementModal.scss";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminPasswordModal from "./AdminPasswordModal";

const ChapterManagementModal = ({ book, onClose }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    fetchChapters();
  }, [book]);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/chapter/chapters/${book._id}`, {
        withCredentials: true
      });
      if (response.data.success) {
        setChapters(response.data.data);
      } else {
        setError("Không thể tải danh sách chapter");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải danh sách chapter");
      console.error("Error fetching chapters:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      await axios.delete(`http://localhost:5000/api/chapter/chapters/${chapterId}`, {
        withCredentials: true
      });
      setChapters(chapters.filter(chapter => chapter._id !== chapterId));
    } catch (err) {
      setError("Có lỗi xảy ra khi xóa chapter");
      console.error("Error deleting chapter:", err);
    }
  };

  const handleEditChapter = (chapter) => {
    setSelectedChapter(chapter);
    setActionType('edit');
    setShowAdminModal(true);
  };

  const handleDeleteClick = (chapter) => {
    setSelectedChapter(chapter);
    setActionType('delete');
    setShowAdminModal(true);
  };

  const handleAdminConfirm = async (password) => {
    try {
      if (actionType === 'delete' && selectedChapter) {
        await handleDeleteChapter(selectedChapter._id);
      }
      setShowAdminModal(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="chapter-management-overlay">
      <div className="chapter-management-modal">
        <button className="close-btn" onClick={onClose}>
          <CloseIcon />
        </button>

        <div className="modal-header">
          <h2>Quản lý Chapter - {book.bookname}</h2>
        </div>

        {loading ? (
          <div className="loading">Đang tải danh sách chapter...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="chapters-list">
            {chapters.length === 0 ? (
              <div className="empty-state">
                <p>Chưa có chapter nào</p>
              </div>
            ) : (
              chapters.map((chapter) => (
                <div key={chapter._id} className="chapter-item">
                  <div className="chapter-info">
                    <h3>{chapter.chapterName}</h3>
                    <p className="chapter-price">
                      {chapter.price > 0 ? `${chapter.price.toLocaleString()} VND` : 'Miễn phí'}
                    </p>
                  </div>
                  <div className="chapter-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditChapter(chapter)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(chapter)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showAdminModal && (
        <AdminPasswordModal
          onClose={() => setShowAdminModal(false)}
          isOpen={showAdminModal}
          onConfirm={handleAdminConfirm}
          onCancel={() => setShowAdminModal(false)}
          action={actionType === 'edit' ? 'sửa' : 'xóa'}
          message={`Vui lòng nhập mật khẩu admin để ${
            actionType === 'edit' ? 'sửa' : 'xóa'
          } chapter`}
        />
      )}
    </div>
  );
};

ChapterManagementModal.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    bookname: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChapterManagementModal; 