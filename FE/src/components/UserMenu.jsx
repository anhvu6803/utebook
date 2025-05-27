import React, { useState, useEffect } from "react";
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
import LogoutIcon from '@mui/icons-material/Logout';

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [user, setUser] = useState(null);
    const [hoaPhuongAmount, setHoaPhuongAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
                setUser(res.data);
                if (res.data && res.data._id) {
                    const pointRes = await axios.get(`http://localhost:5000/api/points/${res.data._id}`);
                    setHoaPhuongAmount(pointRes.data.data.quantity_HoaPhuong || 0);
                }
            } catch (err) {
                console.error('Error fetching user or point:', err);
            }
        };
        fetchUser();
    }, []);

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
            window.location.href = 'http://localhost:5173/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Determine member type
    const isVip = user?.isVip || user?.type === 'vip' || user?.isMember;

    return (
        <div className="user-menu-container"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="user-avatar" onClick={() => handleLoadLink("/utebook/account/profile")}> 
                <img src={testAvatar} alt="testAvatar" className="avatar" />
            </div>

            <div className={`user-dropdown ${isOpen ? "active" : ""}`}>
                <div className="user-header">
                    <div className="user-info">
                        <div className="user-self ">
                            <span className="user-name">{user?.fullname || user?.username || 'User'}</span>
                            <img src={user?.avatar || testAvatar} alt="avatar" className="user-avatar" />   
                        </div>
                        <div className="type-container">
                            <div className={`type-member ${isVip ? 'vip' : 'normal'}`}>
                                {isVip ? (<p>Hội viên</p>) : (<p>Gói thường</p>)}
                            </div>
                            <span className="amount-hoaphuong">
                                <Flower />
                                <p>{hoaPhuongAmount.toLocaleString('vi-VN')}</p>
                            </span>
                        </div>
                    </div>

                    <div className="user-actions">
                        {!isVip &&
                            <button onClick={() => handleLoadLink("/utebook/package-plan")}>Trở thành hội viên</button>
                        }
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
