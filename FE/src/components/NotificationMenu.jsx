import React, { useState } from "react";
import "./styles/NotificationMenu.scss"; // Import SCSS

import NotificationsIcon from '@mui/icons-material/Notifications';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

const notifications = [
    {
        id: 1,
        title: "Top truyện ngôn tình 419 (tình một đêm)...",
        description:
            "Những chuyện tình một đêm hay mối quan hệ mập mờ luôn cuốn hút bbbbbbbbb bbbbbbb bbbbbbbbbbbb bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        time: "2 ngày trước",
    },
    {
        id: 2,
        title: "Khóc đỏ mắt với list truyện ngược luyến...",
        description:
            "Nếu bạn đã quen với những bộ truyện ngôn tình ngọt ngào, thì thể loại...",
        time: "2 ngày trước",
    },
    {
        id: 3,
        title: "Giới thiệu sách AI lắng nghe tôi trải lòngaaaaaaaaaaaa",
        description:
            "Cuốn sách là tác phẩm đặc biệt, nơi công nghệ và cảm xúc con người...",
        time: "2 ngày trước",
    },
    {
        id: 4,
        title: "Top 8 cuốn sách mà sinh viên nhất định aaaaaaaaaa",
        description: "Sinh viên là giai đoạn quan trọng để tích lũy kiến thức...",
        time: "3 ngày trước",
    },
];

const NotificationMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="notification-container"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="notification-icon" >
                <NotificationsIcon style={{ fontSize: 30 }} />
            </div>

            <div className={`notification-dropdown ${isOpen ? "active" : ""}`}>
                <div className="menu-header">
                    <span>Thông báo</span>
                </div>

                <div className="notification-list">
                    {notifications.map((item) => (
                        <div key={item.id} className="notification-item">
                            <ImportContactsIcon className="icon" />
                            <div className="content">
                                <span className="time">{item.time}</span>
                                <span className="title">{item.title}</span>
                                <div className="description ellipsis">{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationMenu;
