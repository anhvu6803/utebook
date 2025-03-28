import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AccountSettingMenu.scss"; // Import SCSS
import testAvatar from "../assets/testAvatar.jpg";
import hoaPhuong from "../assets/hoaPhuong.png";

import SupportForm from "./SupportForm";
import { Medal, Leaf } from "lucide-react";
import PersonIcon from '@mui/icons-material/Person';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HeadphonesIcon from '@mui/icons-material/Headphones';

const menuItems = [
    { path: "/utebook/account/profile", label: "Quản lý tài khoản", icon: <PersonIcon /> },
    { path: "/utebook/account/bookcase", label: "Tủ sách cá nhân", icon: <ListAltIcon /> },
    { path: "/utebook/account/achievements", label: "Thành tích", icon: <Medal /> },
    // { path: "/utebook/account/orders", label: "Quản lý đơn hàng", icon: <ReceiptIcon /> },
    { path: "/utebook/account/transaction-histories", label: "Lịch sử giao dịch", icon: <ReceiptLongIcon /> },
];

const hoaPhuongAmount = 100000;
const typeMemeber = 'normal';
const AccountSettingMenu = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const handleClick = (item) => {
        navigate(item.path);
    }
    const handleShowForm = (boolean) => {
        setShowForm(boolean);
    }
    return (
        <div className="account-menu">
            <div className="user-header">
                <div className="user-info">
                    <div className="user-self ">
                        <div className="user-name-container">
                            <span className="user-name">Anh Vu</span>
                            {typeMemeber === 'vip' &&
                                <span className="vip-expire">Hội viên hết hạn 08/12/2025</span>
                            }
                        </div>
                        <img src={testAvatar} alt="testAvatar" className="user-avatar" />
                    </div>

                    <div className="type-container">
                        {/* <div className={`type-member ${typeMemeber}`}>
                            {typeMemeber === 'vip' ? (<p>Hội viên</p>) : (<p>Gói thường</p>)}
                        </div> */}
                        <span className="amount-hoaphuong">
                            <img src={hoaPhuong} />
                            <p>{(hoaPhuongAmount).toLocaleString('vi-VN')}</p>
                        </span>
                        <span className="amount-leaf">
                            <Leaf />
                            <p>{(hoaPhuongAmount).toLocaleString('vi-VN')}</p>
                        </span>
                    </div>
                </div>
                <div className="user-actions">
                    <button className="btn">Mua hoa</button>
                    {typeMemeber === 'vip' ?
                        (
                            <button className={`btn ${typeMemeber}`}>
                                Xem gói cước
                            </button>
                        ) : (
                            <button className="btn">
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
        </div>
    );
};

export default AccountSettingMenu;
