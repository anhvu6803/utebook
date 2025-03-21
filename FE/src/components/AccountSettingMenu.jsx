import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/AccountSettingMenu.scss"; // Import SCSS
import testAvatar from "../assets/testAvatar.jpg";

import PersonIcon from '@mui/icons-material/Person';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import LogoutIcon from '@mui/icons-material/Logout';

const menuItems = [
    { path: "/utebook/account/profile", label: "Quản lý tài khoản", icon: <PersonIcon /> },
    { path: "/utebook/account/bookcase", label: "Tủ sách cá nhân", icon: <ListAltIcon /> },
    { path: "/utebook/account/orders", label: "Quản lý đơn hàng", icon: <ReceiptIcon /> },
    { path: "/utebook/account/transaction-histories", label: "Lịch sử giao dịch", icon: <ReceiptLongIcon /> },
    { path: "/utebook/account/support", label: "Hỗ trợ khách hàng", icon: <HeadphonesIcon /> },
    { path: "/", label: "Đăng xuất", icon: <LogoutIcon /> },
];

const AccountSettingMenu = () => {
    const navigate = useNavigate();
    console.log(location.pathname);
    return (
        <div className="account-menu">
            <div className="user-header">
                <div className="user-info">
                    <span className="user-name">Anh Vu</span>
                    <img src={testAvatar} alt="testAvatar" className="user-avatar" />

                </div>
                <div className="user-actions">
                    <button>Trở thành hội viên</button>
                </div>
            </div>

            <ul className="menu-list">
                {menuItems.map((item) => (
                    <li
                        key={item.label}
                        className={location.pathname === item.path ? "active" : ""}
                        onClick={() => navigate(item.path)}
                    >
                        {item.icon} {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AccountSettingMenu;
