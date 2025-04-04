import { useEffect } from 'react';
import PropTypes from 'prop-types';
import '../pages/styles/Toast.scss';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="toast-container">
      <div className={`toast ${type}`}>
        <div className="toast-content">{message}</div>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error']).isRequired,
  onClose: PropTypes.func.isRequired
};

export default Toast; 