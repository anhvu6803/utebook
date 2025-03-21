import { useState } from "react";
import PropTypes from "prop-types";
import LockIcon from "@mui/icons-material/Lock";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import "./styles/AdminPasswordModal.scss";

const MOCK_ADMIN_PASSWORD = "admin123"; // Mật khẩu admin giả lập

const AdminPasswordModal = ({ user, action, onConfirm, onCancel }) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (!password.trim()) return;
    setLoading(true);
    setErrorMessage("");

    setTimeout(() => {
      if (password === MOCK_ADMIN_PASSWORD) {
        onConfirm(user);
      } else {
        setErrorMessage("⚠ Mật khẩu không đúng! Vui lòng thử lại.");
        setPassword(""); // Xóa nội dung nhập
      }
      setLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConfirm();
  };

  return (
    <div className="admin-password-modal">
        <div className="modal-overlay">
        <div className="modal-content">
            <h2><LockIcon /> Xác nhận quyền admin</h2>
            <p>
            {action === "delete"
                ? `Bạn có chắc chắn muốn xóa?`
                : `Bạn có chắc chắn muốn chỉnh sửa thông tin?`}
            </p>

            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập mật khẩu admin..."
            className="confirmation-input"
            />

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="modal-actions">
            <button className="confirm-btn" onClick={handleConfirm} disabled={loading}>
                {loading ? "Đang xác nhận..." : <CheckIcon />}
            </button>
            <button className="cancel-btn" onClick={onCancel} disabled={loading}>
                <CloseIcon />
            </button>
            </div>
        </div>
        </div>
    </div>
  );
};

AdminPasswordModal.propTypes = {
  user: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AdminPasswordModal;
