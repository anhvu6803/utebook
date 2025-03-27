import { FaUser, FaCalendarAlt, FaCrown, FaMoneyBillWave, FaTimes, FaCheck, FaCreditCard, FaEdit } from "react-icons/fa";
import { useState } from "react";
import "./styles/MembershipDetailModal.scss";

const MembershipDetailModal = ({ membership, onClose, onStatusChange }) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(membership?.payment?.status || '');
  
  if (!membership) return null;

  const getTypeClass = (type) => {
    switch(type) {
      case 'Hội viên Bạc':
        return 'silver';
      case 'Hội viên Vàng':
        return 'gold';
      case 'Hội viên Bạch Kim':
        return 'platinum';
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
            <div className="membership-id">Mã giao dịch: {membership.id}</div>
            <div className={`membership-status ${getStatusClass(membership.payment.status)}`}>
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
                          onStatusChange(membership.id, newStatus);
                        } else {
                          console.log(`Status changed for membership ${membership.id}: ${newStatus}`);
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
                        setNewStatus(membership.payment.status);
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
                  <span>{membership.payment.status}</span>
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
              <div className={`membership-type ${getTypeClass(membership.type)}`}>
                <FaCrown />
                <span>{membership.type}</span>
              </div>
              <div className="membership-duration">
                {membership.duration}
              </div>
            </div>
            
            <div className="membership-description">
              <h3>{membership.fullName}</h3>
              <div className="membership-date">
                <FaCalendarAlt /> Ngày giao dịch: {membership.transactionDate} 
                <span style={{marginLeft: '10px', fontSize: '12px', color: '#777'}}>({membership.time})</span>
              </div>
              <div className="membership-expiry">
                <FaCreditCard /> Phương thức: {membership.payment.method}
              </div>
            </div>
          </div>
          
          <div className="membership-details">
            <div className="detail-group">
              <h3><FaUser /> Thông tin người dùng</h3>
              <div className="detail-row">
                <span className="detail-label">Tên đầy đủ:</span>
                <span className="detail-value">{membership.fullName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mã người dùng:</span>
                <span className="detail-value">{membership.userId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{membership.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số điện thoại:</span>
                <span className="detail-value">{membership.phone}</span>
              </div>
            </div>
            
            <div className="detail-group">
              <h3><FaCrown /> Thông tin gói hội viên</h3>
              <div className="detail-row">
                <span className="detail-label">Loại hội viên:</span>
                <span className="detail-value">{membership.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Thời hạn:</span>
                <span className="detail-value">{membership.duration}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Trạng thái hội viên:</span>
                <span className={`detail-value ${membership.membershipStatus === "Hoạt động" ? "success" : "pending"}`}>
                  {membership.membershipStatus}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ngày hết hạn:</span>
                <span className="detail-value">{membership.expiryDate}</span>
              </div>
            </div>
            
            <div className="detail-group">
              <h3><FaMoneyBillWave /> Thông tin thanh toán</h3>
              <div className="detail-row">
                <span className="detail-label">Phương thức:</span>
                <span className="detail-value">{membership.payment.method}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số tiền:</span>
                <span className="detail-value">{membership.payment.amount}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mã giao dịch:</span>
                <span className="detail-value">{membership.payment.transactionId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Trạng thái:</span>
                <span className={`detail-value status-pill ${getStatusClass(membership.payment.status)}`}>
                  <div className="status-indicator"></div>
                  {membership.payment.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="membership-benefits">
            <h3>Lợi ích gói hội viên</h3>
            <ul className="benefits-list">
              {membership.benefits.map((benefit, index) => (
                <li key={index}>
                  <FaCheck className="check-icon" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipDetailModal;