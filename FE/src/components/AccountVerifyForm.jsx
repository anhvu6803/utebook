import React, { useState, useRef, useEffect } from "react";
import "./styles/AccountVerifyForm.scss";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const AccountVerifyForm = () => {
    const [showForm, setShowForm] = useState(false);
    const [isContinuous, setContinuous] = useState(false);
    const [phone, setPhone] = useState('');
    const [isShowWarning, setShowWarning] = useState(false);
    const [error, setError] = useState('');

    //OTP
    const length = 4;
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const validatePhone = (value) => {
        // Kiểm tra số điện thoại Việt Nam: bắt đầu bằng 0 và có 10 chữ số
        const phoneRegex = /^0[0-9]{9}$/;
        return phoneRegex.test(value);
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Chỉ cho phép nhập số và giới hạn tối đa 10 ký tự
        const formattedValue = value.replace(/\D/g, '').slice(0, 10);
        setPhone(formattedValue);
    };

    const handleContinue = () => {
        if (validatePhone(phone)) {
            // Simulate sending OTP
            setContinuous(true);
            setTimeLeft(30);
            setError('');
        }
        setShowWarning(true);
    };

    const handleCloseForm = () => {
        setOtp(new Array(length).fill(""));
        setContinuous(false);
        setShowWarning(false);
        setCanResend(false);
        setShowForm(false);
        setError('');
    };

    // OTP
    const handleChange = (e, index) => {
        let value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

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
        setTimeLeft(30);
        setCanResend(false);
        setError('');
    };

    const handleVerifyOTP = () => {
        // Simulate OTP verification
        const otpCode = otp.join('');
        if (otpCode.length === length) {
            handleCloseForm();
        } else {
            setError('Mã xác thực không đúng');
        }
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
                {!isContinuous ? (
                    <>
                        <h2>Xác thực tài khoản</h2>
                        <p>Vui lòng xác thực số điện thoại để bảo mật và đồng bộ tài khoản của bạn dễ dàng hơn</p>
                        <HighlightOffIcon className="close-icon" onClick={handleCloseForm} />
                        <div className="verify-form-content">
                            <div class="input-container-outline">
                                <label for="phone">Số điện thoại</label>
                                <input type="tel" value={phone} onChange={handlePhoneChange} />
                            </div>
                            {isShowWarning && !validatePhone(phone) && (
                                <span className="warning-text">Số điện thoại không đúng định dạng</span>
                            )}
                            {error && <span className="warning-text">{error}</span>}
                            <button onClick={handleContinue}>Tiếp tục</button>
                        </div>
                    </>
                ) : (
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
                        <HighlightOffIcon className="close-icon" onClick={handleCloseForm} />
                        <div className="verify-form-content">
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
                            {error && <span className="warning-text">{error}</span>}
                            <button onClick={handleVerifyOTP}>Xác nhận</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AccountVerifyForm;
