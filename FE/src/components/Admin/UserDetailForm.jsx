import PropTypes from "prop-types";
import { useState } from "react";
import AdminPasswordModal from "./AdminPasswordModal";
import "./styles/UserDetailForm.scss";

const UserDetailForm = ({ user, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAction, setPasswordAction] = useState(null);
  if (!user) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setPasswordAction('edit');
    setShowPasswordModal(true);
  };

  const handleDelete = () => {
    setPasswordAction('delete');
    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = () => {
    if (passwordAction === 'edit') {
      setIsEditing(true);
    } else if (passwordAction === 'delete') {
      onDelete(user.id);
    }
    setShowPasswordModal(false);
  };

  const handlePointsChange = (amount) => {
    if (!isEditing) return;
    
    setFormData(prev => ({
      ...prev,
      points: Math.max(0, parseInt(prev.points) + amount)
    }));
  };

  return (
    <div className="user-detail-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>✖</button>
          <h2>Thông tin người dùng</h2>

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
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Địa chỉ:</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Vai trò:</label>
                  <span className={`role ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </div>

                <div className="form-group">
                  <label>Hội viên:</label>
                  {isEditing ? (
                    <select 
                      name="membership"
                      value={formData.membership ? "true" : "false"}
                      onChange={(e) => {
                        const isMember = e.target.value === "true";
                        setFormData(prev => ({
                          ...prev,
                          membership: isMember,
                          membershipDays: isMember ? prev.membershipDays || 30 : 0
                        }));
                      }}
                    >
                      <option value="true">Có</option>
                      <option value="false">Không</option>
                    </select>
                  ) : (
                    <span className={`membership ${user.membership ? "yes" : "no"}`}>
                      {user.membership ? "Có" : "Không"}
                    </span>
                  )}
                </div>

                {(user.membership || (isEditing && formData.membership)) && (
                  <div className="form-group">
                    <label>Thời gian hội viên:</label>
                    {isEditing ? (
                      <select
                        name="membershipDays"
                        value={formData.membershipDays}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            membershipDays: parseInt(e.target.value)
                          }));
                        }}
                      >
                        <option value="1">1 ngày</option>
                        <option value="30">1 tháng</option>
                        <option value="365">1 năm</option>
                      </select>
                    ) : (
                      <span className="membership-days">
                        {user.membershipDays} ngày
                      </span>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label>Điểm hiện có:</label>
                  <div className="points-control">
                    {isEditing ? (
                      <>
                        <button 
                          type="button" 
                          className="points-btn minus"
                          onClick={() => handlePointsChange(-100)}
                        >
                          -100
                        </button>
                        <input
                          type="number"
                          name="points"
                          value={formData.points}
                          onChange={handleInputChange}
                          min="0"
                        />
                        <button 
                          type="button" 
                          className="points-btn plus"
                          onClick={() => handlePointsChange(100)}
                        >
                          +100
                        </button>
                      </>
                    ) : (
                      <span className="points-display">{user.points} điểm</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              {!isEditing ? (
                <>
                  <button type="button" className="edit-btn" onClick={handleEditClick}>
                    Chỉnh sửa
                  </button>
                  <button type="button" className="delete-btn" onClick={handleDelete}>
                    Xóa người dùng
                  </button>
                </>
              ) : (
                <>
                  <button type="submit" className="save-btn">
                    Lưu
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => {
                    setIsEditing(false);
                    setFormData(user);
                  }}>
                    Hủy
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Chỉ render AdminPasswordModal khi showPasswordModal là true */}
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
    id: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    membership: PropTypes.bool.isRequired,
    membershipDays: PropTypes.number,
    avatar: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserDetailForm;
