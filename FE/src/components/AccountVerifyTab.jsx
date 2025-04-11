import React, { useState } from "react";
import "./styles/AccountVerifyTab.scss";

import AccountVerifyForm from "./AccountVerifyForm";

const AccountVerifyTab = ({ userData }) => {
    const email = userData.email || '';
    const phoneNumber = userData.numberPhone || '';
    const isPhoneVerified = userData.isPhoneVerified || false;
    const isVeryfied = userData.isVerified || false;

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
                    <input type="text" value={phoneNumber} disabled />
                </div>
                {!isPhoneVerified && <span className="warning-text">Chưa xác thực số điện thoại</span>}
                {!isPhoneVerified ?
                    (
                        <div className="verify-btn">
                            <AccountVerifyForm userId={userData._id} />
                        </div>


                    )
                    :
                    (<span className="verified-text">Đã xác thực</span>)
                }
            </div>

            {/* Mật khẩu */}
            <div className="field">
                <div class="input-container">
                    <label for="Password">Mật khẩu</label>
                    <input type="password" value={'vu683nqa'} disabled />
                </div>
            </div>
        </div>
    );
};

export default AccountVerifyTab;
