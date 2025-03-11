import React from 'react';
import './test.scss';

export default function Test() {
    return (
        <div className="app">
            <div className="sidebar">
                <div className="sidebar-header">
                    <span>Đoạn chat</span>
                </div>
                <div className="contact-list">
                    <div className="contact">
                        <div className="contact-info">
                            <div className="contact-avatar"></div>
                            <div className="contact-name">
                                Thanh Hằng <span className="status">Chăm cho gia đình t-1 giờ</span>
                            </div>
                        </div>
                    </div>
                    {/* Add more contacts */}
                </div>
            </div>

            <div className="chat-window">
                <div className="chat-header">
                    <span>Trung Nghĩa</span>
                    <span className="status">Hoạt động 1 giờ trước</span>
                </div>
                <div className="chat-body">
                    <div className="message">
                        <div className="message-sender">Trung Nghĩa</div>
                        <div className="message-text">2h mới học máy mà :))</div>
                    </div>
                    <div className="message">
                        <div className="message-sender">Trung Nghĩa</div>
                        <div className="message-text">h nâng quá lười lên quá :))</div>
                    </div>
                </div>
                <div className="chat-footer">
                    <input type="text" placeholder="Nhập tin nhắn..." />
                    <button>Tiếp tục</button>
                </div>
            </div>
        </div>
    );
}

