import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AuthorSettingMenu.scss"; // Import SCSS
import testAvatar from "../assets/testAvatar.jpg";

import PersonIcon from '@mui/icons-material/Person';
import ListAltIcon from '@mui/icons-material/ListAlt';

const menuItems = [
    { path: "/utebook/author/channel", label: "Hồ sơ tác giả", icon: <PersonIcon /> },
    { path: "/utebook/account/my-story", label: "Truyện của tôi", icon: <ListAltIcon /> },
];

const AuthorSettingMenu = () => {
    const navigate = useNavigate();
    const handleClick = (item) => {
        navigate(item.path);
    }

    return (
        <div className="author-menu">
            <div className="author-header">
                <div className="author-info">
                    <div className="author-self ">
                        <img src={testAvatar} alt="testAvatar" className="author-avatar" />

                        <span className="author-name">Anh Vu</span>
                    </div>
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
            </ul>
        </div >
    );
};

export default AuthorSettingMenu;
