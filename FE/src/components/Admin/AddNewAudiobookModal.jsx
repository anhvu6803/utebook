import { useState } from "react";
import PropTypes from "prop-types";
import "./styles/AddNewAudiobookModal.scss";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AudioFileIcon from "@mui/icons-material/AudioFile";

const AddAudiobookModal = ({ onConfirm, onCancel }) => {
  const [newAudiobook, setNewAudiobook] = useState({
    title: "",
    author: "",
    genre: "Văn học",
    price: "",
    cover: null,
    audioFile: null,
    narrator: "",
    duration: "",
    description: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [audioFileName, setAudioFileName] = useState("");

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? 
      (e.target.value === '' ? '' : Number(value)) : 
      e.target.value;
    setNewAudiobook({ ...newAudiobook, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAudiobook({ ...newAudiobook, cover: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAudiobook({ ...newAudiobook, audioFile: file });
      setAudioFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAudiobook.title || !newAudiobook.author || !newAudiobook.price || 
        !newAudiobook.cover || !newAudiobook.audioFile || !newAudiobook.narrator) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }
    onConfirm(newAudiobook);
  };

  return (
    <div className="add-audiobook-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Thêm Sách Nghe Mới</h2>
            <button className="close-btn" onClick={onCancel}>
              <CloseIcon />
            </button>
          </div>

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

                <div className="audio-upload-container">
                  <input
                    type="file"
                    id="audio-upload"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    className="file-input"
                  />
                  <label htmlFor="audio-upload" className="upload-label">
                    <div className="upload-placeholder">
                      <AudioFileIcon />
                      <span>{audioFileName || "Tải file audio lên"}</span>
                      <span className="sub-text">Chọn hoặc kéo thả file audio vào đây</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-fields">
                <div className="form-group">
                  <label>Tiêu đề <span className="required">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={newAudiobook.title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề sách nghe"
                  />
                </div>

                <div className="form-group">
                  <label>Tác giả <span className="required">*</span></label>
                  <input
                    type="text"
                    name="author"
                    value={newAudiobook.author}
                    onChange={handleChange}
                    placeholder="Nhập tên tác giả"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Thể loại <span className="required">*</span></label>
                    <select name="genre" value={newAudiobook.genre} onChange={handleChange}>
                      <option value="Văn học">Văn học</option>
                      <option value="Khoa học">Khoa học</option>
                      <option value="Kinh tế">Kinh tế</option>
                      <option value="Tâm lý">Tâm lý</option>
                      <option value="Thiếu nhi">Thiếu nhi</option>
                      <option value="Ngoại ngữ">Ngoại ngữ</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Giá (VND) <span className="required">*</span></label>
                    <input
                      type="number"
                      name="price"
                      value={newAudiobook.price}
                      onChange={handleChange}
                      placeholder="Nhập giá sách"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Người đọc <span className="required">*</span></label>
                    <input
                      type="text"
                      name="narrator"
                      value={newAudiobook.narrator}
                      onChange={handleChange}
                      placeholder="Nhập tên người đọc"
                    />
                  </div>

                  <div className="form-group">
                    <label>Thời lượng</label>
                    <input
                      type="text"
                      name="duration"
                      value={newAudiobook.duration}
                      onChange={handleChange}
                      placeholder="VD: 2 giờ 30 phút"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    value={newAudiobook.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả sách nghe"
                    rows="4"
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="confirm-btn">
                Thêm sách nghe
              </button>
              <button type="button" className="cancel-btn" onClick={onCancel}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddAudiobookModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddAudiobookModal;