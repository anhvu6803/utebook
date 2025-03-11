import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/AccountSettingPage.scss";

import AccountInfoTab from "../components/AccountInfoTab";
import AccountAddressTab from "../components/AccountAddressTab";
import AccountVerifyTab from "../components/AccountVerifyTab";

const AccountSettingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") || "AccountInfo";
    const [activeTab, setActiveTab] = useState(tab);

    useEffect(() => {
        setActiveTab(tab); // Cập nhật activeTab khi URL thay đổi
    }, [tab]);

    const handleTabClick = (tabName) => {
        navigate(`/utebook/account/profile?tab=${tabName}`); // Cập nhật URL khi nhấn tab
    };
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
                    <button
                        onClick={() => handleTabClick('AccountAddress')}
                        className={`tab ${activeTab === 'AccountAddress' ? 'active' : ''}`}
                    >
                        Địa chỉ
                    </button>
                    <button
                        onClick={() => handleTabClick('AccountVerify')}
                        className={`tab ${activeTab === 'AccountVerify' ? 'active' : ''}`}
                    >
                        Tài khoản và bảo mật
                    </button>
                    <button
                        onClick={() => handleTabClick('AccountLink')}
                        className={`tab ${activeTab === 'AccountLink' ? 'active' : ''}`}
                    >
                        Tài khoản liên kết
                    </button>
                </div>
            </div>
            <div className="profile-content">
                {activeTab === 'AccountInfo' && <AccountInfoTab />}
                {activeTab === 'AccountAddress' && <AccountAddressTab />}
                {activeTab === 'AccountVerify' && <AccountVerifyTab />}
            </div>
        </div>
    );
};

export default AccountSettingPage;