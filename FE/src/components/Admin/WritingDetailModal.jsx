import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import './styles/WritingDetailModal.scss';

const WritingDetailModal = ({ writing, onClose, onApprove, onReject }) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!writing) return null;

  const handleReject = () => {
    if (!showRejectForm) {
      setShowRejectForm(true);
      return;
    }
    if (rejectReason.trim()) {
      onReject(writing, rejectReason);
      setShowRejectForm(false);
      setRejectReason('');
    }
  };

  const renderActionButtons = () => {
    if (showRejectForm) {
      return (
        <div className="reject-form">
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Nhập lý do từ chối..."
            className="reject-reason-input"
          />
          <div className="reject-form-buttons">
            <button 
              className="cancel-btn"
              onClick={() => setShowRejectForm(false)}
            >
              Hủy
            </button>
            <button 
              className="confirm-reject-btn"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Xác nhận từ chối
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Hiện nút Từ chối khi trạng thái là Đã duyệt hoặc Chờ duyệt */}
        {(writing.status === 'approved' || writing.status === 'pending') && (
          <button 
            className="reject-btn" 
            onClick={handleReject}
          >
            <CancelIcon />
            Từ chối
          </button>
        )}
        
        {/* Hiện nút Phê duyệt khi trạng thái là Từ chối hoặc Chờ duyệt */}
        {(writing.status === 'rejected' || writing.status === 'pending') && (
          <button 
            className="approve-btn"
            onClick={() => onApprove(writing.id)}
          >
            <CheckCircleIcon />
            Phê duyệt
          </button>
        )}
        
        <button className="close-btn" onClick={onClose}>
          Đóng
        </button>
      </>
    );
  };

  return (
    <div className="writing-detail-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div className="header-main">
              <h2>{writing.title}</h2>
              <span className={`status ${writing.status}`}>
                {writing.status === 'pending' && 'Chờ duyệt'}
                {writing.status === 'approved' && 'Đã duyệt'}
                {writing.status === 'rejected' && 'Từ chối'}
              </span>
            </div>
            <button className="close-btn" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="modal-body">
            <div className="info-grid">
              <div className="info-item">
                <PersonIcon />
                <div className="info-content">
                  <label>Tác giả</label>
                  <span>{writing.author}</span>
                </div>
              </div>
              <div className="info-item">
                <CategoryIcon />
                <div className="info-content">
                  <label>Thể loại</label>
                  <span>{writing.category}</span>
                </div>
              </div>
              <div className="info-item">
                <AccessTimeIcon />
                <div className="info-content">
                  <label>Ngày nộp</label>
                  <span>{writing.submitDate}</span>
                </div>
              </div>
            </div>

            <div className="content-section">
              <div className="section-title">
                <DescriptionIcon />
                <h3>Mô tả tác phẩm</h3>
              </div>
              <div className="section-content description">
                {writing.description}
              </div>
            </div>

            <div className="content-section">
              <div className="section-title">
                <PictureAsPdfIcon />
                <h3>Nội dung tác phẩm</h3>
              </div>
              <div className="section-content pdf-content">
                <button className="view-pdf-btn" onClick={() => window.open(writing.pdfUrl, '_blank')}>
                  <PictureAsPdfIcon />
                  Xem tập tin PDF
                </button>
              </div>
            </div>

            {writing.status === 'rejected' && writing.rejectReason && (
              <div className="content-section reject-reason">
                <div className="section-title">
                  <CancelIcon />
                  <h3>Lý do từ chối</h3>
                </div>
                <div className="section-content">
                  {writing.rejectReason}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            {renderActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingDetailModal; 