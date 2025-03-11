import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    const handleLoadLink = (path) => {
        navigate(path); // Chuyển hướng trang
    }
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

                <div className="user-actions">
                    <button>Trở thành hội viên</button>
                </div>

                <ul className="menu-list">
                    <li
                        onClick={() => handleLoadLink("/utebook/account/profile")}
                    >
                        <PersonIcon /> Quản lý tài khoản
                    </li>
                    <li
                        onClick={() => handleLoadLink("/utebook/library")}
                    >
                        <ListAltIcon /> Tủ sách cá nhân
                    </li>
                    <li
                        onClick={() => handleLoadLink("/utebook/orders")}
                    >
                        <ReceiptIcon /> Quản lý đơn hàng
                    </li>
                    <li
                        onClick={() => handleLoadLink("/utebook/transactions")}
                    >
                        <ReceiptLongIcon /> Lịch sử giao dịch
                    </li>
                    <li
                        onClick={() => handleLoadLink("/utebook/support")}
                    >
                        <HeadphonesIcon /> Hỗ trợ khách hàng
                    </li>
                    <li
                        onClick={() => handleLoadLink("/logout")}
                    >
                        <LogoutIcon /> Đăng xuất
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserMenu;
