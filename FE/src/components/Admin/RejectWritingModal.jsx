import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import './styles/RejectWritingModal.scss';

const RejectWritingModal = ({ writing, onClose, onConfirm }) => {
  const [rejectReason, setRejectReason] = useState('');

  const handleSubmit = () => {
    if (!rejectReason.trim()) return;
    onConfirm(rejectReason);
    onClose();
  };

  return (
    <div className="reject-writing-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div className="header-icon">
              <WarningAmberIcon />
            </div>
            <h2>Từ chối tác phẩm</h2>
            <button className="close-btn" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="modal-body">
            <div className="writing-info">
              <p><strong>Tác phẩm:</strong> {writing.title}</p>
              <p><strong>Tác giả:</strong> {writing.author}</p>
            </div>
            
            <div className="reason-input">
              <label>Lý do từ chối</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Vui lòng nhập lý do từ chối tác phẩm..."
                rows={5}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
            <button 
              className="confirm-btn" 
              onClick={handleSubmit}
              disabled={!rejectReason.trim()}
            >
              Xác nhận từ chối
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectWritingModal; 