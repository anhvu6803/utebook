import { FaUser, FaCalendarAlt, FaStar, FaInfoCircle, FaTimes, FaBook, FaMoneyBillWave } from "react-icons/fa";
import "./styles/ActivityDetailModal.scss";

const ActivityDetailModal = ({ activity, onClose }) => {
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
            <div className="activity-id">Mã giao dịch: {activity.id}</div>
            <div className={`activity-status ${activity.status === 'Thành công' ? 'success' : 'failed'}`}>
              {activity.status}
            </div>
          </div>
          
          <div className="activity-main-info">
            <div className="activity-points-container">
              <div className={`activity-points ${parseInt(activity.points) >= 0 ? 'positive' : 'negative'}`}>
                {activity.points}
              </div>
              <div className={`activity-action ${getActionClass(activity.action)}`}>
                {activity.action}
              </div>
            </div>
            
            <div className="activity-description">
              <h3>{activity.description}</h3>
              <div className="activity-datetime">
                <FaCalendarAlt /> {activity.date} {activity.time}
              </div>
            </div>
          </div>
          
          <div className="activity-details">
            <div className="detail-group">
              <h3><FaUser /> Thông tin người dùng</h3>
              <div className="detail-row">
                <span className="detail-label">Tên người dùng:</span>
                <span className="detail-value">{activity.username}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mã người dùng:</span>
                <span className="detail-value">{activity.userId}</span>
              </div>
            </div>
            
            <div className="detail-group">
              <h3><FaStar /> Thông tin điểm</h3>
              <div className="detail-row">
                <span className="detail-label">Số dư trước:</span>
                <span className="detail-value">{activity.previousBalance} điểm</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Thay đổi:</span>
                <span className={`detail-value ${parseInt(activity.points) >= 0 ? 'positive' : 'negative'}`}>
                  {activity.points} điểm
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số dư sau:</span>
                <span className="detail-value">{activity.currentBalance} điểm</span>
              </div>
            </div>
            
            {(activity.action === "Đọc" || activity.action === "Thu nhập") && activity.book && (
              <div className="detail-group">
                <h3><FaBook /> Thông tin sách</h3>
                <div className="detail-row">
                  <span className="detail-label">Tên sách:</span>
                  <span className="detail-value">{activity.book.title}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tác giả:</span>
                  <span className="detail-value">{activity.book.author}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Mã sách:</span>
                  <span className="detail-value">{activity.book.id}</span>
                </div>
                {activity.action === "Đọc" && (
                  <div className="detail-row">
                    <span className="detail-label">Số trang đã đọc:</span>
                    <span className="detail-value">{activity.pagesRead} trang</span>
                  </div>
                )}
                {activity.action === "Thu nhập" && (
                  <div className="detail-row">
                    <span className="detail-label">Loại thu nhập:</span>
                    <span className="detail-value">{activity.incomeType || "Hoàn thành đọc sách"}</span>
                  </div>
                )}
              </div>
            )}
            
            {activity.action === "Nạp" && (
              <div className="detail-group">
                <h3><FaMoneyBillWave /> Thông tin nạp điểm</h3>
                <div className="detail-row">
                  <span className="detail-label">Phương thức:</span>
                  <span className="detail-value">{activity.paymentMethod}</span>
                </div>
                {activity.transactionId && (
                  <div className="detail-row">
                    <span className="detail-label">Mã giao dịch:</span>
                    <span className="detail-value">{activity.transactionId}</span>
                  </div>
                )}
                {activity.amount && (
                  <div className="detail-row">
                    <span className="detail-label">Số tiền:</span>
                    <span className="detail-value">{activity.amount}đ</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Tỷ lệ quy đổi:</span>
                  <span className="detail-value">1000đ = 1 điểm</span>
                </div>
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
          
          {activity.relatedActivities && activity.relatedActivities.length > 0 && (
            <div className="related-activities">
              <h3>Hoạt động liên quan</h3>
              <div className="related-list">
                {activity.relatedActivities
                  .filter(related => ["Nạp", "Đọc", "Thu nhập"].includes(related.action))
                  .map(related => (
                    <div className="related-activity-item" key={related.id}>
                      <div className="related-id">{related.id}</div>
                      <div className={`related-action ${getActionClass(related.action)}`}>{related.action}</div>
                      <div className={`related-points ${parseInt(related.points) >= 0 ? 'positive' : 'negative'}`}>
                        {related.points}
                      </div>
                      <div className="related-date">{related.date}</div>
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

export default ActivityDetailModal;