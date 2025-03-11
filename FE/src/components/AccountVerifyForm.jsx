import React, { useState, useRef, useEffect } from "react";
import "./styles/AccountVerifyForm.scss";

import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const AccountVerifyForm = () => {
    const [showForm, setShowForm] = useState(false);
    const [isContinuous, setContinuous] = useState(false);
    const [phone, setPhone] = useState('');
    const [isShowWarning, setShowWarning] = useState(false);
    
    //OTP
    const length = 4;
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);
    const [timeLeft, setTimeLeft] = useState(30); // 30 giây đếm ngược
    const [canResend, setCanResend] = useState(false);

    const validatePhone = (value) => {
        const phoneRegex = /^0[0-9]{9,10}$/; // Kiểm tra số điện thoại 10-11 chữ số
        return phoneRegex.test(value);
    };

    const handleContinue = () => {
        if (validatePhone(phone)) {
            setContinuous(true);
            setTimeLeft(30);
        }
        setShowWarning(true);
    };

    const handleCloseForm = () => {
        setOtp(new Array(length).fill(""));
        setContinuous(false);
        setShowWarning(false);
        setCanResend(false)
        setShowForm(false);
    };

    // OTP
    const handleChange = (e, index) => {
        let value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return; // Chỉ cho phép số

        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Tự động chuyển sang ô tiếp theo nếu nhập số
        if (value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleResendOTP = () => {
        setTimeLeft(30); // Reset lại 30 giây
        setCanResend(false);
    };
    return (
        <div className="verify-form-container">

            {showForm && <div className="backdrop" />}

            <button className="create-verify-btn"
                onClick={() => setShowForm(true)}
            >
                Xác thực
            </button>
            <div className={`verify-form ${showForm ? "show" : ""}`}>
                {!isContinuous ?
                    (
                        <>
                            <h2>Xác thực tài khoản</h2>
                            <p>Vui lòng xác thực số điện thoại để bảo mật và đồng bộ tài khoản của bạn dễ dàng hơn</p>
                            <HighlightOffIcon className="close-icon" onClick={handleCloseForm} />
                            <div className="verify-form-content" >
                                <div class="input-container-outline">
                                    <label for="phone">Số điện thoại</label>
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                {isShowWarning && <span className="warning-text">Số điện thoại không đúng định dạng</span>}

                                <button onClick={handleContinue}>Tiếp tục </button>
                            </div>
                        </>
                    ) :
                    (
                        <>
                            <h2>Xác nhận OTP</h2>
                            <p>
                                Mã xác nhận đã được gửi về số điện thoại
                                <span style={{
                                    color: '#005bbb',
                                    fontWeight: 'bold'
                                }}>
                                    {` ` + phone}
                                </span>
                            </p>
                            <HighlightOffIcon className="close-icon" onClick={() => setShowForm(false)} />
                            <div className="verify-form-content" >
                                <div className="otp-container">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            value={digit}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            maxLength="1"
                                            className="otp-input"
                                        />
                                    ))}
                                </div>
                                <div className="otp-resend">
                                    {canResend ? (
                                        <span className="resend-btn" onClick={handleResendOTP}>
                                            Gửi lại OTP
                                        </span>
                                    ) : (
                                        <span className="countdown">
                                            Gửi lại OTP sau{" "}
                                            <span className="time">{`0${Math.floor(timeLeft / 60)}:${String(
                                                timeLeft % 60
                                            ).padStart(2, "0")}s`}</span>
                                        </span>
                                    )}
                                </div>
                                <button onClick={() => setContinuous(true)}>Tiếp tục </button>
                            </div>
                        </>
                    )}

            </div>
        </div >
    );
};

export default AccountVerifyForm;
