import PropTypes from "prop-types";
import "./styles/UserDetailForm.scss";

const UserDetailForm = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="user-detail-modal">
        <div className="modal-overlay">
        <div className="modal-content">
            <button className="close-btn" onClick={onClose}>✖</button>
            <h2>Thông tin người dùng</h2>

            <div className="user-info-container">
            <div className="user-avatar-container">
                <img className="user-avatar" src={user.avatar} alt="Avatar" />
            </div>

            <div className="user-details">
                <p><strong>Họ tên:</strong> {user.fullname}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Số điện thoại:</strong> {user.phone}</p>
                <p><strong>Địa chỉ:</strong> {user.address}</p>
                <p>
                <strong>Vai trò:</strong> 
                <span className={`role ${user.role.toLowerCase()}`}>
                    {user.role}
                </span>
                </p>
                <p>
                <strong>Hội viên:</strong> 
                <span className={`membership ${user.membership ? "yes" : "no"}`}>
                    {user.membership ? "Có" : "Không"}
                </span>
                </p>
                {user.membership && (
                <p>
                    <strong>Thời gian còn lại:</strong> 
                    <span className="membership-days">
                    {user.membershipDays} ngày
                    </span>
                </p>
                )}
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

UserDetailForm.propTypes = {
  user: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    membership: PropTypes.bool.isRequired,
    membershipDays: PropTypes.number,
    avatar: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};

export default UserDetailForm;
