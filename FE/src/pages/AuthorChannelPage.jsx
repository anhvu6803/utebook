// UserProfile.jsx
import React from 'react';
import './styles/AuthorChannelPage.scss';
import { FileText, List, Heart, Star } from 'lucide-react';

const AuthorChannelPage = () => {
    return (
        <div className="profile-container">
            <div className="section achievements">
                <div className="section-header">
                    <span className="leaf-icon">🍃</span>
                    <h2>Thành tích</h2>
                </div>

                <div className="stats-container">
                    <div className="stat-box">
                        <div className="icon-circle">
                            <FileText size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>0</h3>
                            <p>Truyện đã đăng</p>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="icon-circle">
                            <List size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>0</h3>
                            <p>Chương đã đăng</p>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="icon-circle">
                            <Heart size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>0</h3>
                            <p>Người theo dõi</p>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="icon-circle">
                            <Star size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>0</h3>
                            <p>Đề cử</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section personal-info">
                <div className="section-header">
                    <span className="leaf-icon">🍃</span>
                    <h2>Thông tin cá nhân</h2>
                </div>

                <div className="info-form">
                    <div className="form-row">
                        <label>Tên hiển thị</label>
                        <div className="form-value">Anh Vurr</div>
                    </div>

                    <div className="form-row">
                        <label>Giới thiệu</label>
                        <div className="form-value">Đang cập nhật</div>
                    </div>

                    <button className="update-button">CẬP NHẬT</button>
                </div>
            </div>
        </div>
    );
};

export default AuthorChannelPage;