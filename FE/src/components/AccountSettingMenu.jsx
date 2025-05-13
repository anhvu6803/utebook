import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./styles/AccountSettingMenu.scss"; // Import SCSS

import SupportForm from "./SupportForm";
import { Leaf, Flower } from "lucide-react";
import PersonIcon from '@mui/icons-material/Person';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const menuItems = [
    { path: "/utebook/account/profile", label: "Quản lý tài khoản", icon: <PersonIcon /> },
    { path: "/utebook/account/bookcase", label: "Tủ sách cá nhân", icon: <ListAltIcon /> },
    // { path: "/utebook/account/achievements", label: "Thành tích", icon: <Medal /> },
    // { path: "/utebook/account/orders", label: "Quản lý đơn hàng", icon: <ReceiptIcon /> },
    { path: "/utebook/account/transaction-histories", label: "Lịch sử giao dịch", icon: <ReceiptLongIcon /> },
];
const defaultAvatar = 'https://res.cloudinary.com/dbmynlh3f/image/upload/v1744354478/cciryt3jpun1dys5rz8s.png';

const typeMemeber = 'normal';
const AccountSettingMenu = () => {
    const auth = useAuth();
    const userData = auth.user;
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [profilePicture, setProfilePicture] = useState(userData?.avatar || defaultAvatar);
    const [hoaPhuongAmount, setHoaPhuongAmout] = useState(0);
    const [leafAmount, setLeafAmount] = useState(0);
    const handleClick = (item) => {
        navigate(item.path);
    }
    const handleLoadLink = (path) => {
        navigate(path); // Chuyển hướng trang
        window.location.reload();
    }
    const handleShowForm = (boolean) => {
        setShowForm(boolean);
    }

    useEffect(() => {
        if (userData) {
            const getPoints = async () => {
                try {
                    const res = await axios.get(
                        `http://localhost:5000/api/points/${userData._id}`
                    )
                    if (res.data.success) {
                        setHoaPhuongAmout(res.data.data.quantity_HoaPhuong);
                        setLeafAmount(res.data.data.quantity_La);
                    }
                }
                catch(err){
                    console.log(err); // eslint-disable-line no-consolen
                }
            }
            getPoints();
        }
    }, []);
    return (
        <div className="account-menu">
            <div className="user-header">
                <div className="user-info">
                    <div className="user-self ">
                        <div className="user-name-container">
                            <span className="user-name">{userData?.fullname || 'Unknown'}</span>
                            {userData?.isMember &&
                                <span className="vip-expire">Hội viên hết hạn {new Date(userData?.membershipExpirationDate).toLocaleDateString('vi-VN')}</span>
                            }
                        </div>
                        <img
                            src={profilePicture}
                            alt="testAvatar"
                            className="user-avatar"
                            onError={() => setProfilePicture(defaultAvatar)}
                        />
                    </div>

                    <div className="type-container">
                        {/* <div className={`type-member ${typeMemeber}`}>
                            {typeMemeber === 'vip' ? (<p>Hội viên</p>) : (<p>Gói thường</p>)}
                        </div> */}
                        <span className="amount-hoaphuong">
                            <Flower />
                            <p>{(hoaPhuongAmount).toLocaleString('vi-VN')}</p>
                        </span>
                        <span className="amount-leaf">
                            <Leaf />
                            <p>{(leafAmount).toLocaleString('vi-VN')}</p>
                        </span>
                    </div>
                </div>
                <div className="user-actions">
                    <button
                        className="btn"
                        onClick={() => handleLoadLink("/utebook/package-plan/hoa-phuong")}
                    >
                        Mua hoa
                    </button>
                    {typeMemeber === 'vip' ?
                        (
                            <button
                                onClick={() => handleLoadLink("/utebook/package-plan")}
                                className={`btn ${typeMemeber}`}
                            >
                                Xem gói cước
                            </button>
                        ) : (
                            <button
                                className="btn"
                                onClick={() => handleLoadLink("/utebook/package-plan")}
                            >
                                Trở thành hội viên
                            </button>
                        )}

                </div>

            </div>

            <ul className="menu-list">
                {menuItems.map((item) => (
                    <li
                        key={item.label}
                        className={location.pathname === item.path ? "active" : ""}
                        onClick={() => handleClick(item)}
                    >
                        {item.icon} {item.label}
                    </li>
                ))}
                <SupportForm
                    showForm={showForm}
                    handleShowForm={handleShowForm}
                />
            </ul>
        </div >
    );
};

export default AccountSettingMenu;
