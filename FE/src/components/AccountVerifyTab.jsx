import React, { useState } from "react";
import "./styles/AccountVerifyTab.scss";

import AccountVerifyForm from "./AccountVerifyForm";

const AccountVerifyTab = ({ userData }) => {
    const [isVeryfied, setIsVerified] = useState(userData.isVerified);
    const email = userData.email || '';
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    const handleVerify = () => {
        // Giả lập quá trình xác thực
        setIsPhoneVerified(true);
    };

    return (
        <div className="verification-container">
            {/* Email */}
            <div className="field">
                <div class="input-container">
                    <label for="Email">Email</label>
                    <input type="text" value={email} disabled />
                </div>
                <span className="verified-text">Đã xác thực</span>
            </div>

            {/* Số điện thoại */}
            <div className="field">
                <div class="input-container">
                    <label for="Phone">Số điện thoại</label>
                    <input type="text" value={'Chưa xác thực'} disabled />
                </div>
                {!isPhoneVerified && <span className="warning-text">Chưa xác thực số điện thoại</span>}
                {!isPhoneVerified && (
                    <div className="verify-btn">
                        <AccountVerifyForm />
                    </div>

                    // <button className="verify-btn" onClick={handleVerify}>Xác thực</button>
                )}
            </div>

            {/* Mật khẩu */}
            <div className="field">
                <div class="input-container">
                    <label for="Password">Mật khẩu</label>
                    <input type="password" value={'vu683nqa'} disabled />
                </div>
            </div>

            {/* Xóa tài khoản */}
            <p className="delete-account">
                Bạn không có nhu cầu sử dụng tài khoản nữa? <span>Xóa tài khoản</span>
            </p>
        </div>
    );
};

export default AccountVerifyTab;
