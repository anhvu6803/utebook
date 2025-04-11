import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/AccountSettingPage.scss";
import axios from "axios";

import AccountInfoTab from "../components/AccountInfoTab";
import AccountAddressTab from "../components/AccountAddressTab";
import AccountVerifyTab from "../components/AccountVerifyTab";

const AccountSettingPage = () => {
    const userId = '67f60e6a96d8bc11b320179b';
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") || "AccountInfo";
    const [activeTab, setActiveTab] = useState(tab);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/get-me/${userId}`, {
                    withCredentials: true
                });
                    console.log(response.data.user.user);
                    setUser(response.data.user.user);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin người dùng');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        setActiveTab(tab);
    }, [tab]);

    const handleTabClick = (tabName) => {
        navigate(`/utebook/account/profile?tab=${tabName}`);
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="profile-settings">
            <div className="profile-header">
                <h1 className="title">Quản lý thông tin</h1>
                <div className="tabs">
                    <button
                        onClick={() => handleTabClick('AccountInfo')}
                        className={`tab ${activeTab === 'AccountInfo' ? 'active' : ''}`}
                    >
                        Thông tin cá nhân
                    </button>
                    {/* <button
                        onClick={() => handleTabClick('AccountAddress')}
                        className={`tab ${activeTab === 'AccountAddress' ? 'active' : ''}`}
                    >
                        Địa chỉ
                    </button> */}
                    <button
                        onClick={() => handleTabClick('AccountVerify')}
                        className={`tab ${activeTab === 'AccountVerify' ? 'active' : ''}`}
                    >
                        Tài khoản và bảo mật
                    </button>
                </div>
            </div>
            <div className="profile-content">
                {activeTab === 'AccountInfo' && <AccountInfoTab userData={user} />}
                {/* {activeTab === 'AccountAddress' && <AccountAddressTab user={user} />} */}
                {activeTab === 'AccountVerify' && <AccountVerifyTab userData={user} />}
            </div>
        </div>
    );
};

export default AccountSettingPage;