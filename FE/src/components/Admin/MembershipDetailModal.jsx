import { FaUser, FaCalendarAlt, FaCrown, FaMoneyBillWave, FaTimes, FaCheck, FaCreditCard, FaEdit } from "react-icons/fa";
import { useState } from "react";
import "./styles/MembershipDetailModal.scss";

const MembershipDetailModal = ({ membership, onClose, onStatusChange }) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(membership?.status || '');
  
  if (!membership) return null;

  const getTypeClass = (type) => {
    switch(type) {
      case 'UTEBOOK 1 ngày':
        return 'daily';
      case 'UTEBOOK 1 tháng':
        return 'monthly';
      case 'UTEBOOK 6 tháng':
        return 'six-month';
      case 'UTEBOOK 1 năm':
        return 'yearly';
      default:
        return '';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Thành công':
        return 'success';
      case 'Đang xử lý':
        return 'pending';
      case 'Thất bại':
        return 'failed';
      case 'Hoàn tiền':
        return 'refunded';
      default:
        return '';
    }
  };

  return (
    <div className="membership-modal-overlay" onClick={onClose}>
      <div className="membership-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="membership-modal-header">
          <h2>Chi Tiết Giao Dịch Đăng Ký Hội Viên</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="membership-card">
          <div className="membership-header">
            <div className="membership-id">
              <span className="label">Mã giao dịch:</span>
              <span className="value">{membership._id}</span>
            </div>
            <div className={`membership-status ${getStatusClass(membership.status)}`}>
              {isEditingStatus ? (
                <div className="status-edit-container">
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)}
                    className={`status-select ${getStatusClass(newStatus)}`}
                  >
                    <option value="Thành công">Thành công</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Thất bại">Thất bại</option>
                    <option value="Hoàn tiền">Hoàn tiền</option>
                  </select>
                  <div className="status-edit-actions">
                    <button 
                      className="save-status" 
                      onClick={() => {
                        if (typeof onStatusChange === 'function') {
                          onStatusChange(membership._id, newStatus);
                        } else {
                          console.log(`Status changed for membership ${membership._id}: ${newStatus}`);
                          setIsEditingStatus(false);
                          onClose();
                        }
                      }}
                      title="Lưu thay đổi"
                    >
                      <FaCheck />
                    </button>
                    <button 
                      className="cancel-edit" 
                      onClick={() => {
                        setNewStatus(membership.status);
                        setIsEditingStatus(false);
                      }}
                      title="Hủy thay đổi"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="status-display">
                  <div className="status-indicator"></div>
                  <span>{membership.status}</span>
                  <button 
                    className="edit-status-button" 
                    onClick={() => setIsEditingStatus(true)}
                    title="Thay đổi trạng thái"
                  >
                    <FaEdit />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="membership-main-info">
            <div className="membership-type-container">
              <div className={`membership-type ${getTypeClass(membership.packageId?.name)}`}>
                <FaCrown />
                <span>{membership.packageId?.name}</span>
              </div>
              <div className="membership-duration">
                <FaCalendarAlt />
                <span>{membership.packageId?.expire} ngày</span>
              </div>
            </div>
            
            <div className="membership-description">
              <div className="user-info">
                <FaUser />
                <h3>{membership.id_user?.fullname}</h3>
              </div>
              <div className="transaction-info">
                <div className="info-item">
                  <FaCalendarAlt />
                  <div className="info-content">
                    <span className="label">Ngày giao dịch:</span>
                    <span className="value">
                      {new Date(membership.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="time">
                      {new Date(membership.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <FaCreditCard />
                  <div className="info-content">
                    <span className="label">Phương thức:</span>
                    <span className="value">{membership.transactionId?.vnp_CardType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="membership-details">
            <div className="detail-group">
              <h3><FaUser /> Thông tin người dùng</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Tên đầy đủ:</span>
                  <span className="detail-value">{membership.id_user?.fullname}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mã người dùng:</span>
                  <span className="detail-value">{membership.id_user?._id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{membership.id_user?.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tên đăng nhập:</span>
                  <span className="detail-value">{membership.id_user?.username}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-group">
              <h3><FaCrown /> Thông tin gói hội viên</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Loại hội viên:</span>
                  <span className="detail-value">{membership.packageId?.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Thời hạn:</span>
                  <span className="detail-value">{membership.packageId?.expire} ngày</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mô tả:</span>
                  <span className="detail-value">{membership.packageId?.description}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Giá gói:</span>
                  <span className="detail-value highlight">{membership.packageId?.price.toLocaleString()} VNĐ</span>
                </div>
              </div>
            </div>
            
            <div className="detail-group">
              <h3><FaMoneyBillWave /> Thông tin thanh toán</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Phương thức:</span>
                  <span className="detail-value">{membership.transactionId?.vnp_CardType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Số tiền:</span>
                  <span className="detail-value highlight">{membership.transactionId?.amount.toLocaleString()} VNĐ</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mã giao dịch:</span>
                  <span className="detail-value">{membership.transactionId?._id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mã ngân hàng:</span>
                  <span className="detail-value">{membership.transactionId?.vnp_BankCode}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mã giao dịch ngân hàng:</span>
                  <span className="detail-value">{membership.transactionId?.vnp_BankTranNo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mã giao dịch VNPay:</span>
                  <span className="detail-value">{membership.transactionId?.vnp_TransactionNo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Thời gian thanh toán:</span>
                  <span className="detail-value">{membership.transactionId?.vnp_PayDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipDetailModal;