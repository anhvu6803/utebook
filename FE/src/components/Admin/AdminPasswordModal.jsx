import PropTypes from "prop-types";
import { useState } from "react";
import "./styles/AdminPasswordModal.scss";
import { Visibility, VisibilityOff, Warning, Error } from '@mui/icons-material';

const AdminPasswordModal = ({ onClose, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Thay thế mật khẩu này bằng mật khẩu thực từ backend của bạn
    const ADMIN_PASSWORD = "admin123"; 

    if (password === ADMIN_PASSWORD) {
      onConfirm();
      setPassword('');
      setError('');
    } else {
      setError('Mật khẩu không chính xác!');
    }
  };

  // Cải tiến hàm xử lý đóng modal
  const handleClose = () => {
    setError('');
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="admin-password-modal" onClick={handleOverlayClick}>
      <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔒 Xác thực Admin</h2>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu admin"
              autoFocus
            />
            <div 
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </div>
          </div>
          
          {error && (
            <div className="error-message">
              <Error />
              <span>{error}</span>
            </div>
          )}
        </form>

        <div className="modal-footer">
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => handleClose()}
          >
            Hủy bỏ
          </button>
          <button 
            className="confirm-btn" 
            onClick={handleSubmit}
            disabled={!password}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

AdminPasswordModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default AdminPasswordModal;
