import React from 'react';
import './styles/Loading.scss';

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="loading-spinner">
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                </div>
                <div className="loading-text">Đang xử lý...</div>
            </div>
        </div>
    );
};

export default Loading; 