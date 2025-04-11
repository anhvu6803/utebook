import React, { useState, useRef, useEffect } from "react";
import "./styles/AccountVerifyForm.scss";
import axios from "axios";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { number } from "prop-types";
const AccountVerifyForm = ({ userId }) => {
    const [showForm, setShowForm] = useState(false);
    const [isContinuous, setContinuous] = useState(false);
    const [phone, setPhone] = useState('');
    const [isShowWarning, setShowWarning] = useState(false);
    const [error, setError] = useState('');
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };
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

    const handleSendOTP = async (e) => {
        try {
            setAlert({ ...alert, open: false });
            const response = await axios.post("http://localhost:5000/api/twilio/send-verification", { phoneNumber: phone });
            if (response.data.success) {
                setAlert({
                    open: true,
                    message: 'Gửi mã xác thực thành công',
                    severity: 'success'
                });
            }
        }
        catch (error) {
            setAlert({
                open: true,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi gửi mã xác thực',
                severity: 'error'
            });
        }
    };

    const handleContinue = (e) => {
        if (validatePhone(phone)) {
            handleSendOTP(e);
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

    const handleResendOTP = async (e) => {
        setTimeLeft(30);
        setCanResend(false);
        setError('');
        handleSendOTP(e);
    };

    const handleVerifyOTP = async (e) => {
        const otpCode = otp.join('');
        try {
            setAlert({ ...alert, open: false });
            const response = await axios.post("http://localhost:5000/api/twilio/verify-phone", { phoneNumber: phone, code: otpCode });
            console.log(response.data.data.status);
            if (response.data.data.status === 'approved') {
                setAlert({
                    open: true,
                    message: 'Xác thực thành công',
                    severity: 'success'
                });
                await axios.patch(
                    `http://localhost:5000/api/user/${userId}`,
                    {
                        numberPhone: phone,
                        isPhoneVerified: true
                    }
                );
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
            else {
                setAlert({
                    open: true,
                    message: 'Mã xác thực không đúng',
                    severity: 'error'
                });
            }
        }
        catch (error) {
            setAlert({
                open: true,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi gửi mã xác thực',
                severity: 'error'
            });
        }
    };

    return (
        <>
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
            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{
                    left: '10px !important',
                    bottom: '80px !important'
                }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={alert.severity}
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AccountVerifyForm;
