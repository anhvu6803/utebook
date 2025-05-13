import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./styles/AccountSettingPage.scss";

import AccountInfoTab from "../components/AccountInfoTab";
import AccountVerifyTab from "../components/AccountVerifyTab";

const AccountSettingPage = () => {
    const auth = useAuth();
    console.log(auth);

    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") || "AccountInfo";
    const [activeTab, setActiveTab] = useState(tab);

    useEffect(() => {
        setActiveTab(tab);
    }, [tab]);

    const handleTabClick = (tabName) => {
        navigate(`/utebook/account/profile?tab=${tabName}`);
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
                    {/* <button
                        onClick={() => handleTabClick('AccountAddress')}
                        className={`tab ${activeTab === 'AccountAddress' ? 'active' : ''}`}
                    >
                        Địa chỉ
                    </button> */}
                    {/* <button
                        onClick={() => handleTabClick('AccountVerify')}
                        className={`tab ${activeTab === 'AccountVerify' ? 'active' : ''}`}
                    >
                        Tài khoản và bảo mật
                    </button> */}
                </div>
            </div>
            <div className="profile-content">
                {activeTab === 'AccountInfo' && <AccountInfoTab userData={auth.user} />}
                {/* {activeTab === 'AccountAddress' && <AccountAddressTab user={user} />} */}
                {/* {activeTab === 'AccountVerify' && <AccountVerifyTab userData={user} />} */}
            </div>
        </div>
    );
};

export default AccountSettingPage;