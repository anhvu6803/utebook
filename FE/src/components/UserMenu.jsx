import React, { useState } from "react";
import "./styles/UserMenu.scss"; // Import SCSS
import testAvatar from "../assets/testAvatar.jpg";

import PersonIcon from '@mui/icons-material/Person';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import LogoutIcon from '@mui/icons-material/Logout';

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="user-menu-container"
            onMouseEnter={() => setIsOpen(true)} // Mở khi di chuột vào
            onMouseLeave={() => setIsOpen(false)} // Đóng khi rời chuột khỏi menu
        >
            <div className="user-avatar" onClick={() => setIsOpen(!isOpen)}>
                <img src={testAvatar} alt="testAvatar" className="avatar" />
            </div>

            <div className={`user-dropdown ${isOpen ? "active" : ""}`}>
                <div className="user-info">
                    <span className="user-name">Anh Vu</span>
                    <img src={testAvatar} alt="testAvatar" className="user-avatar" />
                </div>

                <ul className="menu-list">
                    <li><PersonIcon /> Quản lý tài khoản</li>
                    <li><ListAltIcon /> Tủ sách cá nhân</li>
                    <li><ReceiptIcon /> Quản lý đơn hàng</li>
                    <li><ReceiptLongIcon /> Lịch sử giao dịch</li>
                    <li><HeadphonesIcon /> Hỗ trợ khách hàng</li>
                    <li><LogoutIcon /> Đăng xuất</li>
                </ul>
            </div>
        </div>
    );
};

export default UserMenu;
