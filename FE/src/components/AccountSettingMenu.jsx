import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AccountSettingMenu.scss"; // Import SCSS
import testAvatar from "../assets/testAvatar.jpg";

import PersonIcon from '@mui/icons-material/Person';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import LogoutIcon from '@mui/icons-material/Logout';

const AccountSettingMenu = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("Quản lý tài khoản"); // Mục mặc định

    const handleLoadLink = (path, item) => {
        setActiveItem(item); // Cập nhật active item
        navigate(path); // Chuyển hướng trang
    };
    return (
        <div className="account-menu">
            <div className="user-info">
                <span className="user-name">Anh Vu</span>
                <img src={testAvatar} alt="testAvatar" className="user-avatar" />
            </div>

            <div className="user-actions">
                <button>Trở thành hội viên</button>
            </div>

            <ul className="menu-list">
                <li
                    className={activeItem === "Quản lý tài khoản" ? "active" : ""}
                    onClick={() => handleLoadLink("/utebook/account/profile", "Quản lý tài khoản")}
                >
                    <PersonIcon /> Quản lý tài khoản
                </li>
                <li
                    className={activeItem === "Tủ sách cá nhân" ? "active" : ""}
                    onClick={() => handleLoadLink("/utebook/library", "Tủ sách cá nhân")}
                >
                    <ListAltIcon /> Tủ sách cá nhân
                </li>
                <li
                    className={activeItem === "Quản lý đơn hàng" ? "active" : ""}
                    onClick={() => handleLoadLink("/utebook/orders", "Quản lý đơn hàng")}
                >
                    <ReceiptIcon /> Quản lý đơn hàng
                </li>
                <li
                    className={activeItem === "Lịch sử giao dịch" ? "active" : ""}
                    onClick={() => handleLoadLink("/utebook/transactions", "Lịch sử giao dịch")}
                >
                    <ReceiptLongIcon /> Lịch sử giao dịch
                </li>
                <li
                    className={activeItem === "Hỗ trợ khách hàng" ? "active" : ""}
                    onClick={() => handleLoadLink("/utebook/support", "Hỗ trợ khách hàng")}
                >
                    <HeadphonesIcon /> Hỗ trợ khách hàng
                </li>
                <li
                    className={activeItem === "Đăng xuất" ? "active" : ""}
                    onClick={() => handleLoadLink("/logout", "Đăng xuất")}
                >
                    <LogoutIcon /> Đăng xuất
                </li>
            </ul>
        </div>
    );
};

export default AccountSettingMenu;
