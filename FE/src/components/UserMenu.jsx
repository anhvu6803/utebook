import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/UserMenu.scss"; // Import SCSS
import testAvatar from "../assets/testAvatar.jpg";
import hoaPhuong from "../assets/hoaPhuong.png";

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
                                <img src={hoaPhuong} alt="testAvatar" className="avatar-hoaphuong" />
                                <p>{(hoaPhuongAmount).toLocaleString('vi-VN')}</p>
                            </span>
                        </div>
                    </div>
                    {typeMemeber !== 'vip' &&
                        <div className="user-actions">
                            <button>Trở thành hội viên</button>
                        </div>
                    }
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
                        onClick={() => handleLoadLink("/")}
                    >
                        <LogoutIcon /> Đăng xuất
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserMenu;
