import PropTypes from "prop-types";
import "./styles/AudiobookDetail.scss";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useState } from "react";
import AdminPasswordModal from "./AdminPasswordModal";

const AudiobookDetail = ({ audiobook, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [editedAudiobook, setEditedAudiobook] = useState({ ...audiobook });

  const handleEdit = () => {
    setActionType('edit');
    setShowAdminModal(true);
  };

  const handleDelete = () => {
    setActionType('delete');
    setShowAdminModal(true);
  };

  const handlePlay = () => {
    // Thêm logic để phát audio
    console.log("Phát audio:", audiobook.title);
  };

  const handleAdminConfirm = () => {
    if (actionType === 'edit') {
      setIsEditing(true);
    } else if (actionType === 'delete') {
      onDelete(audiobook);
      onClose();
    }
    setShowAdminModal(false);
  };

  const handleSave = () => {
    onUpdate(editedAudiobook);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAudiobook({ ...audiobook });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAudiobook(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  if (!audiobook) return null;

  return (
    <div className="book-detail-overlay">
      <div className="book-detail-modal">
        <button className="close-btn" onClick={onClose}>
          <CloseIcon />
        </button>
        
        <div className="book-content">
          <div className="book-image-section">
            <img src={audiobook.cover} alt={audiobook.title} className="book-cover" />
            <div className="action-buttons">
              {!isEditing ? (
                <>
                  <button className="play-btn" onClick={handlePlay}>
                    <PlayArrowIcon />
                    Nghe thử
                  </button>
                  <button className="edit-btn" onClick={handleEdit}>
                    <EditIcon />
                    Sửa
                  </button>
                  <button className="delete-btn" onClick={handleDelete}>
                    <DeleteIcon />
                    Xóa
                  </button>
                </>
              ) : (
                <>
                  <button className="save-btn" onClick={handleSave}>
                    <SaveIcon />
                    Lưu
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    <CloseIcon />
                    Hủy
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="book-info">
            <div className="info-group">
              <label>Tiêu đề:</label>
              <input
                type="text"
                name="title"
                value={editedAudiobook.title}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
              />
            </div>

            <div className="info-group">
              <label>Tác giả:</label>
              <input
                type="text"
                name="author"
                value={editedAudiobook.author}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
              />
            </div>

            <div className="info-group">
              <label>Thể loại:</label>
              <input
                name="genre"
                value={editedAudiobook.genre}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
              >
              </input>
            </div>

            <div className="info-group">
              <label>Giá:</label>
              <input
                type="number"
                name="price"
                value={editedAudiobook.price}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
              />
            </div>

            <div className="info-group">
              <label>Thời lượng:</label>
              <input
                type="text"
                name="duration"
                value={editedAudiobook.duration || "Chưa có thông tin"}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
                placeholder="VD: 2 giờ 30 phút"
              />
            </div>

            <div className="info-group">
              <label>Người đọc:</label>
              <input
                type="text"
                name="narrator"
                value={editedAudiobook.narrator || "Chưa có thông tin"}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
              />
            </div>

            <div className="info-group">
              <label>Mô tả:</label>
              <textarea
                name="description"
                value={editedAudiobook.description || "Chưa có mô tả"}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
                rows="4"
              />
            </div>
          </div>
        </div>
      </div>

      {showAdminModal && (
        <AdminPasswordModal
          onClose={() => setShowAdminModal(false)}
          onConfirm={handleAdminConfirm}
          onCancel={() => setShowAdminModal(false)}
          action={actionType === 'edit' ? 'sửa' : 'xóa'}
          message={`Vui lòng nhập mật khẩu admin để ${
            actionType === 'edit' ? 'sửa' : 'xóa'
          } sách nghe`}
        />
      )}
    </div>
  );
};

AudiobookDetail.propTypes = {
  audiobook: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    cover: PropTypes.string.isRequired,
    duration: PropTypes.string,
    narrator: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default AudiobookDetail;