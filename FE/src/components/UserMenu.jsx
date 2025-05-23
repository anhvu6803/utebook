import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/UserMenu.scss"; // Import SCSS
import testAvatar from "../assets/testAvatar.jpg";
import { Flower } from "lucide-react";
import axios from 'axios';

import SupportForm from "./SupportForm";
import { Medal } from "lucide-react";
import PersonIcon from '@mui/icons-material/Person';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import LogoutIcon from '@mui/icons-material/Logout';

const hoaPhuongAmount = 100000;
const typeMemeber = 'normal';
const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const handleShowForm = (boolean) => {
        setShowForm(boolean);
    }
    const handleLoadLink = (path) => {
        navigate(path); // Chuyển hướng trang
        window.location.reload();
    }

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                withCredentials: true
            });
            // Chuyển hướng về localhost:5173/ sau khi đăng xuất
            window.location.href = 'http://localhost:5173/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="user-menu-container"
            onMouseEnter={() => setIsOpen(true)} // Mở khi di chuột vào
            onMouseLeave={() => setIsOpen(false)} // Đóng khi rời chuột khỏi menu
        >
            <div className="user-avatar" onClick={() => handleLoadLink("/utebook/account/profile")}>
                <img src={testAvatar} alt="testAvatar" className="avatar" />
            </div>

            <div className={`user-dropdown ${isOpen ? "active" : ""}`}>
                <div className="user-header">
                    <div className="user-info">
                        <div className="user-self ">
                            <span className="user-name">Anh Vu</span>
                            <img src={testAvatar} alt="testAvatar" className="user-avatar" />
                        </div>
                        <div className="type-container">
                            <div className={`type-member ${typeMemeber}`}>
                                {typeMemeber === 'vip' ? (<p>Hội viên</p>) : (<p>Gói thường</p>)}
                            </div>
                            <span className="amount-hoaphuong">
                                <Flower />
                                <p>{(hoaPhuongAmount).toLocaleString('vi-VN')}</p>
                            </span>
                        </div>
                    </div>

                    <div className="user-actions">
                        {typeMemeber !== 'vip' &&
                            <button onClick={() => handleLoadLink("/utebook/package-plan")}>Trở thành hội viên</button>
                        }
                        <button onClick={() => handleLoadLink("/utebook/author")}>Trở thành tác giả </button>
                    </div>
                </div>

                <ul className="menu-list">
                    <li
                        onClick={() => handleLoadLink("/utebook/account/profile")}
                    >
                        <PersonIcon /> Quản lý tài khoản
                    </li>
                    <li
                        onClick={() => handleLoadLink("/utebook/account/bookcase")}
                    >
                        <ListAltIcon /> Tủ sách cá nhân
                    </li>
                    <li
                        onClick={() => handleLoadLink("/utebook/account/achievements")}
                    >
                        <Medal /> Thành tích
                    </li>
                    <li
                        onClick={() => handleLoadLink("/utebook/account/transaction-histories")}
                    >
                        <ReceiptLongIcon /> Lịch sử giao dịch
                    </li>
                    <SupportForm
                        showForm={showForm}
                        handleShowForm={handleShowForm}
                        setOpenMenu={setIsOpen}
                    />
                    <li
                        onClick={handleLogout}
                    >
                        <LogoutIcon /> Đăng xuất
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserMenu;
