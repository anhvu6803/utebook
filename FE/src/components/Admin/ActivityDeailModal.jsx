import { useState, useEffect } from "react";
import { FaUser, FaCalendarAlt, FaStar, FaInfoCircle, FaTimes, FaBook, FaMoneyBillWave, FaCheck, FaEdit } from "react-icons/fa";
import PropTypes from 'prop-types';
import "./styles/ActivityDetailModal.scss";

const ActivityDetailModal = ({ activity, onClose, onStatusChange }) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(activity?.status || 'Thành công');
  const [relatedActivities, setRelatedActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchRelatedActivities = async () => {
      if (!activity?.id_user) return;
      
      setLoading(true);
      try {
        // Lấy các hoạt động của cùng một người dùng trong khoảng 24h trước và sau
        const activityTime = new Date(activity.time);
        const startTime = new Date(activityTime.getTime() - 24 * 60 * 60 * 1000);
        const endTime = new Date(activityTime.getTime() + 24 * 60 * 60 * 1000);
        
        const response = await fetch(`/api/history-points/user/${activity.id_user}?startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`);
        if (!response.ok) throw new Error('Failed to fetch related activities');
        
        const data = await response.json();
        // Lọc bỏ hoạt động hiện tại và sắp xếp theo thời gian
        const filtered = data.data
          .filter(item => item._id !== activity._id)
          .sort((a, b) => new Date(b.time) - new Date(a.time));
        
        setRelatedActivities(filtered);
      } catch (error) {
        console.error('Error fetching related activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedActivities();
  }, [activity]);
  
  if (!activity) return null;

  const getActionClass = (action) => {
    switch(action) {
      case 'Nạp':
        return 'deposit';
      case 'Đọc':
        return 'read';
      case 'Thu nhập':
        return 'income';
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

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Không xác định';
      
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Lỗi khi format ngày:', error);
      return 'Không xác định';
    }
  };

  // Hàm format giờ phút
  const formatTime = (dateString) => {
    if (!dateString) return 'Không xác định';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Không xác định';
      
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Lỗi khi format giờ:', error);
      return 'Không xác định';
    }
  };

  return (
    <div className="activity-modal-overlay" onClick={onClose}>
      <div className="activity-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="activity-modal-header">
          <h2>Chi Tiết Hoạt Động Điểm</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="activity-card">
          <div className="activity-header">
            <div className="activity-id">Mã giao dịch: {activity._id}</div>
            <div className={`activity-status ${getStatusClass(activity.status)}`}>
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
                          onStatusChange(activity._id, newStatus);
                        } else {
                          console.log(`Status changed for activity ${activity._id}: ${newStatus}`);
                        }
                        setIsEditingStatus(false);
                      }}
                      title="Lưu thay đổi"
                    >
                      <FaCheck />
                    </button>
                    <button 
                      className="cancel-edit" 
                      onClick={() => {
                        setNewStatus(activity.status);
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
                  <span>{activity.status}</span>
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
          
          <div className="activity-main-info">
            <div className="activity-points-container">
              <div className={`activity-points ${activity.type === "Nạp" || activity.type === "Thu nhập" ? 'positive' : 'negative'}`}>
                {activity.type === "Nạp" || activity.type === "Thu nhập" ? '+' : ''}{activity.number_point_HoaPhuong}
              </div>
              <div className={`activity-action ${getActionClass(activity.type)}`}>
                {activity.type}
              </div>
            </div>
            
            <div className="activity-description">
              <h3>{activity.description}</h3>
              <div className="activity-datetime">
                <FaCalendarAlt /> {formatDate(activity.time)} {formatTime(activity.time)}
              </div>
            </div>
          </div>
          
          <div className="activity-details">
            <div className="detail-group">
              <h3><FaUser /> Thông tin người dùng</h3>
              <div className="detail-row">
                <span className="detail-label">Tên người dùng:</span>
                <span className="detail-value">{activity.userInfo?.username || 'Không xác định'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Họ và tên:</span>
                <span className="detail-value">{activity.userInfo?.fullname || 'Không xác định'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{activity.userInfo?.email || 'Không xác định'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số điện thoại:</span>
                <span className="detail-value">{activity.userInfo?.numberPhone || 'Không xác định'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mã người dùng:</span>
                <span className="detail-value">{activity.id_user}</span>
              </div>
            </div>
            
            <div className="detail-group">
              <h3><FaStar /> Thông tin điểm</h3>
              <div className="detail-row">
                <span className="detail-label">Điểm Hoa Phượng:</span>
                <span className={`detail-value ${activity.type === "Nạp" || activity.type === "Thu nhập" ? 'positive' : 'negative'}`}>
                  {activity.type === "Nạp" || activity.type === "Thu nhập" ? '+' : ''}{activity.number_point_HoaPhuong}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Điểm Lá:</span>
                <span className={`detail-value ${activity.type === "Nạp" || activity.type === "Thu nhập" ? 'positive' : 'negative'}`}>
                  {activity.type === "Nạp" || activity.type === "Thu nhập" ? '+' : '-'}{activity.number_point_La}
                </span>
              </div>
            </div>
            
            {(activity.type === "Đọc" || activity.type === "Thu nhập") && activity.bookInfo && (
              <div className="detail-group">
                <h3><FaBook /> Thông tin sách</h3>
                <div className="detail-row">
                  <span className="detail-label">Tên sách:</span>
                  <span className="detail-value">{activity.bookInfo.title}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Mã sách:</span>
                  <span className="detail-value">{activity.bookInfo._id}</span>
                </div>
                {activity.type === "Thu nhập" && (
                  <div className="detail-row">
                    <span className="detail-label">Loại thu nhập:</span>
                    <span className="detail-value">Hoàn thành đọc sách</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Từ sách:</span>
                  <span className="detail-value">{activity.bookInfo.title}</span>
                </div>
              </div>
            )}
            
            {activity.type === "Nạp" && (
              <div className="detail-group">
                <h3><FaMoneyBillWave /> Thông tin nạp điểm</h3>
                {activity.transactionInfo ? (
                  <div className="transaction-details">
                    <div className="transaction-header">
                      <div className="transaction-status success">
                        <FaCheck /> {activity.transactionInfo.status === 'success' ? 'Thanh toán thành công' : 'Đang xử lý'}
                      </div>
                      <div className="transaction-amount">
                        {activity.transactionInfo.amount.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                    
                    <div className="transaction-info-grid">
                      <div className="info-item">
                        <span className="info-label">Loại gói</span>
                        <span className="info-value">
                          {activity.transactionInfo.typePackage === 'membership' ? 'Gói thành viên' : 'Gói điểm'}
                        </span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Mã giao dịch</span>
                        <span className="info-value">{activity.transactionInfo._id}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Ngân hàng</span>
                        <span className="info-value">{activity.transactionInfo.vnp_BankCode}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Loại thẻ</span>
                        <span className="info-value">{activity.transactionInfo.vnp_CardType}</span>
                      </div>
                    </div>

                    <div className="transaction-details-section">
                      <h4>Chi tiết giao dịch VNPay</h4>
                      <div className="vnpay-details">
                        <div className="detail-row">
                          <span className="detail-label">Mã giao dịch VNPay:</span>
                          <span className="detail-value">{activity.transactionInfo.vnp_TransactionNo}</span>
                        </div>
                <div className="detail-row">
                          <span className="detail-label">Mã giao dịch ngân hàng:</span>
                          <span className="detail-value">{activity.transactionInfo.vnp_BankTranNo}</span>
                </div>
                  <div className="detail-row">
                          <span className="detail-label">Thời gian thanh toán:</span>
                          <span className="detail-value">
                            {new Date(
                              activity.transactionInfo.vnp_PayDate.replace(
                                /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                                '$1-$2-$3T$4:$5:$6'
                              )
                            ).toLocaleString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-transaction-info">
                    <FaInfoCircle />
                    <span>Không có thông tin giao dịch</span>
                  </div>
                )}
              </div>
            )}
            
            {activity.adminApproved && (
              <div className="detail-group">
                <h3><FaInfoCircle /> Thông tin phê duyệt</h3>
                <div className="detail-row">
                  <span className="detail-label">Phê duyệt bởi:</span>
                  <span className="detail-value">{activity.adminApproved}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Ngày phê duyệt:</span>
                  <span className="detail-value">{activity.approvalDate}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Ghi chú:</span>
                  <span className="detail-value">{activity.remarks || "Không có ghi chú"}</span>
                </div>
              </div>
            )}
          </div>
          
          {relatedActivities.length > 0 && (
            <div className="related-activities">
              <h3>Hoạt động liên quan</h3>
              <div className="related-list">
                {relatedActivities.map(related => (
                  <div className="related-activity-item" key={related._id}>
                    <div className="related-id">{related._id}</div>
                    <div className={`related-action ${getActionClass(related.type)}`}>
                      {related.type}
                    </div>
                    <div className={`related-points ${related.type === "Nạp" || related.type === "Thu nhập" ? 'positive' : 'negative'}`}>
                      {related.type === "Nạp" || related.type === "Thu nhập" ? '+' : ''}{related.number_point_HoaPhuong}
                      </div>
                    <div className="related-date">
                      {formatDate(related.time)} {formatTime(related.time)}
                    </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ActivityDetailModal.propTypes = {
  activity: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    id_user: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['Nạp', 'Đọc', 'Thu nhập']).isRequired,
    status: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    description: PropTypes.string,
    number_point_HoaPhuong: PropTypes.number.isRequired,
    number_point_La: PropTypes.number.isRequired,
    userInfo: PropTypes.shape({
      username: PropTypes.string,
      fullname: PropTypes.string,
      email: PropTypes.string,
      numberPhone: PropTypes.string
    }),
    bookInfo: PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string
    }),
    transactionInfo: PropTypes.shape({
      _id: PropTypes.string,
      status: PropTypes.string,
      amount: PropTypes.number,
      typePackage: PropTypes.string,
      vnp_BankCode: PropTypes.string,
      vnp_CardType: PropTypes.string,
      vnp_TransactionNo: PropTypes.string,
      vnp_BankTranNo: PropTypes.string,
      vnp_PayDate: PropTypes.string
    }),
    adminApproved: PropTypes.string,
    approvalDate: PropTypes.string,
    remarks: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired
};

export default ActivityDetailModal;