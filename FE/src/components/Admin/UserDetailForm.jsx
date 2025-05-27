import PropTypes from "prop-types";
import { useState } from "react";
import AdminPasswordModal from "./AdminPasswordModal";
import "./styles/UserDetailForm.scss";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from "react-toastify";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = 'http://localhost:5000/api/user';

// Hàm format ngày thành dd/mm/yyyy
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const UserDetailForm = ({ user, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    numberPhone: user.numberPhone,
    isMember: user.isMember,
    membershipExpirationDate: user.membershipExpirationDate ? new Date(user.membershipExpirationDate) : null,
    isAdmin: user.isAdmin,
    points: {
      hoaPhuong: user.points?.hoaPhuong || 0,
      la: user.points?.la || 0
    }
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAction, setPasswordAction] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('points.')) {
      const pointType = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        points: {
          ...prev.points,
          [pointType]: parseInt(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date) => {
    // Kiểm tra nếu ngày được chọn nhỏ hơn ngày hiện tại
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      toast.error("Ngày hết hạn phải lớn hơn ngày hiện tại");
      return;
    }
    setFormData(prev => ({
      ...prev,
      membershipExpirationDate: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kiểm tra ngày hết hạn nếu là hội viên
      if (formData.isMember) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!formData.membershipExpirationDate || formData.membershipExpirationDate < today) {
          toast.error("Ngày hết hạn phải lớn hơn ngày hiện tại");
          return;
        }
      }

      setLoading(true);
      // Chuyển đổi ngày hết hạn sang định dạng ISO trước khi gửi lên server
      const updatedData = {
        ...formData,
        membershipExpirationDate: formData.membershipExpirationDate ? 
          formData.membershipExpirationDate.toISOString() : null
      };

      // Gọi API update user
      const response = await axios.patch(`${API_URL}/${user._id}`, updatedData);
      
      if (response.data.success) {
        onUpdate(response.data.data);
        setIsEditing(false);
        toast.success("Cập nhật thông tin thành công");
        onClose(); // Đóng modal sau khi cập nhật thành công
      } else {
        toast.error(response.data.message || "Không thể cập nhật thông tin");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể cập nhật thông tin");
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setPasswordAction('edit');
    setShowPasswordModal(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}/${user._id}`);
      if (response.data.success) {
        onDelete(user._id);
        toast.success("Xóa người dùng thành công");
        onClose(); // Đóng modal
      } else {
        toast.error(response.data.message || "Không thể xóa người dùng");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Nếu user đã bị xóa, vẫn cập nhật UI
        onDelete(user._id);
        toast.success("Xóa người dùng thành công");
        onClose();
      } else {
        toast.error(error.response?.data?.message || "Không thể xóa người dùng");
        console.error("Error deleting user:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordConfirm = async () => {
    try {
      if (passwordAction === 'edit') {
        setIsEditing(true);
      } else if (passwordAction === 'delete') {
        setLoading(true);
        const response = await axios.delete(`${API_URL}/${user._id}`);
        if (response.data.success) {
          onDelete(user._id);
          toast.success("Xóa người dùng thành công");
        } else {
          toast.error(response.data.message || "Không thể xóa người dùng");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể thực hiện thao tác");
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setShowPasswordModal(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      numberPhone: user.numberPhone,
      isMember: user.isMember,
      membershipExpirationDate: user.membershipExpirationDate ? new Date(user.membershipExpirationDate) : null,
      isAdmin: user.isAdmin,
      points: {
        hoaPhuong: user.points?.hoaPhuong || 0,
        la: user.points?.la || 0
      }
    });
  };

  return (
    <div className="user-detail-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Thông tin người dùng</h2>
            <div className="header-actions">
              {!isEditing ? (
                <>
                  <button type="button" className="edit-btn" onClick={handleEditClick}>
                    <EditIcon /> Sửa
                  </button>
                  <button type="button" className="delete-btn" onClick={handleDelete}>
                    <DeleteIcon /> Xóa
                  </button>
                </>
              ) : (
                <>
                  <button type="submit" className="save-btn" onClick={handleSubmit} disabled={loading}>
                    <SaveIcon /> Lưu
                  </button>
                  <button type="button" className="cancel-btn" onClick={handleCancel}>
                    <CancelIcon /> Hủy
                  </button>
                </>
              )}
            </div>
            <button className="close-btn" onClick={onClose}>✖</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="user-info-container">
              <div className="user-avatar-container">
                <img className="user-avatar" src={user.avatar} alt="Avatar" />
              </div>

              <div className="user-details">
                <div className="form-group">
                  <label>Họ tên:</label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại:</label>
                  <input
                    type="tel"
                    name="numberPhone"
                    value={formData.numberPhone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Vai trò:</label>
                  {isEditing ? (
                    <select 
                      name="isAdmin"
                      value={formData.isAdmin ? "true" : "false"}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          isAdmin: e.target.value === "true"
                        }));
                      }}
                    >
                      <option value="true">Admin</option>
                      <option value="false">User</option>
                    </select>
                  ) : (
                    <span className={`role ${user.isAdmin ? "admin" : "user"}`}>
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Hội viên:</label>
                  {isEditing ? (
                    <select 
                      name="isMember"
                      value={formData.isMember ? "true" : "false"}
                      onChange={(e) => {
                        const isMember = e.target.value === "true";
                        setFormData(prev => ({
                          ...prev,
                          isMember,
                          membershipExpirationDate: isMember ? prev.membershipExpirationDate || new Date() : null
                        }));
                      }}
                    >
                      <option value="true">Có</option>
                      <option value="false">Không</option>
                    </select>
                  ) : (
                    <span className={`membership ${user.isMember ? "yes" : "no"}`}>
                      {user.isMember ? "Có" : "Không"}
                    </span>
                  )}
                </div>

                {(user.isMember || (isEditing && formData.isMember)) && (
                  <div className="form-group">
                    <label>Ngày hết hạn:</label>
                    {isEditing ? (
                      <DatePicker
                        selected={formData.membershipExpirationDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        required={formData.isMember}
                        className="date-picker"
                        minDate={new Date()} // Thêm minDate để không cho chọn ngày trong quá khứ
                      />
                    ) : (
                      <span className="membership-days">
                        {formatDate(user.membershipExpirationDate)}
                      </span>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label>Điểm Hoa Phượng:</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="points.hoaPhuong"
                      value={formData.points.hoaPhuong}
                      onChange={handleInputChange}
                      min="0"
                    />
                  ) : (
                    <span className="points-display">{user.points?.hoaPhuong || 0} điểm</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Điểm Lá:</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="points.la"
                      value={formData.points.la}
                      onChange={handleInputChange}
                      min="0"
                    />
                  ) : (
                    <span className="points-display">{user.points?.la || 0} điểm</span>
                  )}
                </div>
              </div>
            </div>
          </form>

          {showPasswordModal && (
            <AdminPasswordModal
              onClose={() => setShowPasswordModal(false)}
              isOpen={showPasswordModal}
              onConfirm={handlePasswordConfirm}
              onCancel={() => setShowPasswordModal(false)}
              action={passwordAction === 'edit' ? 'sửa' : 'xóa'}
              message={`Vui lòng nhập mật khẩu admin để ${
                passwordAction === 'edit' ? 'sửa' : 'xóa'
              } người dùng`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

UserDetailForm.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    numberPhone: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    isMember: PropTypes.bool.isRequired,
    membershipExpirationDate: PropTypes.string,
    isAdmin: PropTypes.bool.isRequired,
    points: PropTypes.shape({
      hoaPhuong: PropTypes.number,
      la: PropTypes.number
    })
  }),
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserDetailForm;
