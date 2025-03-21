import { useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/EditUserModal.scss";

const membershipDurations = {
  "1 ngày": 1,
  "1 tuần": 7,
  "1 tháng": 30,
  "1 năm": 365,
};

const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
};

const EditUserModal = ({ user, onSave, onCancel }) => {
  const today = new Date();
  const defaultJoinDate = user.joinDate ? new Date(user.joinDate) : today;

  const [editedUser, setEditedUser] = useState({
    membership: user.membership ? "yes" : "no",
    joinDate: defaultJoinDate,
    membershipPackage: "1 ngày",
    expiryDate: new Date(defaultJoinDate.getTime() + membershipDurations["1 ngày"] * 86400000),
  });

  const calculateExpiryDate = (joinDate, packageType) => {
    if (!joinDate) return null;
    return new Date(joinDate.getTime() + membershipDurations[packageType] * 86400000);
  };

  const handleDateChange = (date) => {
    setEditedUser((prev) => ({
      ...prev,
      joinDate: date,
      expiryDate: calculateExpiryDate(date, prev.membershipPackage),
    }));
  };

  const handleMembershipChange = (e) => {
    const newPackage = e.target.value;
    setEditedUser((prev) => ({
      ...prev,
      membershipPackage: newPackage,
      expiryDate: calculateExpiryDate(prev.joinDate, newPackage),
    }));
  };

  const handleSave = () => {
    onSave({
      ...user,
      membership: editedUser.membership === "yes",
      joinDate: editedUser.joinDate ? editedUser.joinDate.toISOString() : null,
      membershipPackage: editedUser.membershipPackage,
      expiryDate: editedUser.expiryDate ? editedUser.expiryDate.toISOString() : null,
    });
  };

  return (
    <div className="edit-user-modal">
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-content">
        <h2 className="modal-title">Chỉnh sửa hội viên</h2>

        <div className="user-info">
          <div className="user-avatar">
            <img src={user.avatar || "https://i.pravatar.cc/150"} alt="User Avatar" />
          </div>

          <div className="form-container">
            <div className="input-group">
              <label>Thành viên VIP:</label>
              <select
                name="membership"
                value={editedUser.membership}
                onChange={(e) => setEditedUser({ ...editedUser, membership: e.target.value })}
              >
                <option value="yes">Có</option>
                <option value="no">Không</option>
              </select>
            </div>

            {editedUser.membership === "yes" && (
              <>
                <div className="input-group">
                  <label>Ngày tham gia:</label>
                  <DatePicker
                    selected={editedUser.joinDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="date-picker"
                    placeholderText="Chọn ngày"
                  />
                </div>

                <div className="input-group">
                  <label>Gói hội viên:</label>
                  <select name="membershipPackage" value={editedUser.membershipPackage} onChange={handleMembershipChange}>
                    {Object.keys(membershipDurations).map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Ngày hết hạn:</label>
                  <input
                    type="text"
                    value={formatDate(editedUser.expiryDate)}
                    readOnly
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          <button className="save-btn" onClick={handleSave}>Lưu</button>
        </div>
      </div>
    </div>
  );
};

EditUserModal.propTypes = {
  user: PropTypes.shape({
    membership: PropTypes.bool,
    joinDate: PropTypes.string,
    membershipPackage: PropTypes.string,
    expiryDate: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditUserModal;
