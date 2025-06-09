import "../pages/styles/RegisterPage.scss";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Loading from "../components/Loading";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFirstVerification, setIsFirstVerification] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    password: "",
    confirmPassword: "",
    email: "",
    ngaySinh: null,
    gioiTinh: "Nam",
    numberPhone: "",
    address: "",
    verificationCode: ""
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setErrors({});
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name] && !isAnimating) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Vui lòng nhập tên người dùng";
    if (!formData.fullname) newErrors.fullname = "Vui lòng nhập họ và tên";
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    if (!selectedDate) newErrors.ngaySinh = "Vui lòng chọn ngày sinh";
    if (!formData.numberPhone) newErrors.numberPhone = "Vui lòng nhập số điện thoại";
    if (!formData.address) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.verificationCode) newErrors.verificationCode = "Vui lòng nhập mã xác nhận.";
    
    // Birth date validation
    if (selectedDate) {
      const today = new Date();
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(today.getFullYear() - 2);
      
      if (selectedDate > twoYearsAgo) {
        newErrors.ngaySinh = "Ngày sinh phải cách hiện tại ít nhất 2 năm";
      }
    }
    
    // Password validation
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Mật khẩu phải có ít nhất 1 chữ in hoa";
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "Mật khẩu phải có ít nhất 1 số";
      } else if (!/[!@#$%^&*]/.test(formData.password)) {
        newErrors.password = "Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*)";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResendVerification = async () => {
    try {
      if (!formData.email) {
        setErrors(prev => ({ ...prev, verification: "Vui lòng nhập email trước" }));
        return;
      }

      await axios.post("http://localhost:5000/api/user/send-verification-code", {
        email: formData.email
      });
      setIsFirstVerification(false);
      // Clear any previous verification code
      setFormData(prev => ({ ...prev, verificationCode: "" }));
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Có lỗi xảy ra khi gửi mã xác nhận";
      setErrors(prev => ({ ...prev, verification: errorMessage }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Format the date to ensure it's preserved exactly as selected
      const formattedDate = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000) : null;

      await axios.post("http://localhost:5000/api/user/register", {
        userData: {
          username: formData.username,
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
          ngaySinh: formattedDate,
          gioiTinh: formData.gioiTinh,
          numberPhone: formData.numberPhone,
          address: formData.address,
          isGoogleUser: false
        },
        code: formData.verificationCode
      });
      // Clear verification code after successful registration
      setFormData(prev => ({ ...prev, verificationCode: "" }));
      
      // Keep loading while waiting for navigation
      await new Promise(resolve => setTimeout(resolve, 3000));
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Có lỗi xảy ra khi đăng ký";
      if (errorMessage.includes("expired") || errorMessage.includes("Invalid verification code")) {
        setFormData(prev => ({ ...prev, verificationCode: "" }));
        setErrors(prev => ({ ...prev, verificationCode: "Mã xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng gửi lại mã mới." }));
      } else {
        setErrors(prev => ({ ...prev, submit: errorMessage }));
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {isLoading && <Loading />}
      <div className="container">
        <div className="header-container">
          <h1>Đăng ký</h1>
        </div>
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên người dùng <span className="required">(*)</span></label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên người dùng" 
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>
          <div className="form-group">
            <label>Họ và tên <span className="required">(*)</span></label>
            <input 
              type="text" 
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Nhập họ và tên" 
            />
            {errors.fullname && <span className="error-text">{errors.fullname}</span>}
          </div>
          
          <div className="form-group">
            <label>Ngày tháng năm sinh <span className="required">(*)</span></label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                // Ensure the date is preserved exactly as selected
                const adjustedDate = date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000) : null;
                setSelectedDate(adjustedDate);
                setFormData(prev => ({ ...prev, ngaySinh: adjustedDate }));
                if (errors.ngaySinh) {
                  setErrors(prev => ({ ...prev, ngaySinh: "" }));
                }
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              className="date-picker"
              maxDate={(() => {
                const date = new Date();
                date.setFullYear(date.getFullYear() - 2);
                return date;
              })()}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
            {errors.ngaySinh && <span className="error-text">{errors.ngaySinh}</span>}
          </div>

          <div className="form-group">
            <label>Giới tính <span className="required">(*)</span></label>
            <select 
              name="gioiTinh" 
              value={formData.gioiTinh}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Mật khẩu <span className="required">(*)</span></label>
            <div className="password-input-container">
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu" 
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label>Số điện thoại liên hệ <span className="required">(*)</span></label>
            <input 
              type="tel" 
              name="numberPhone"
              value={formData.numberPhone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại" 
            />
            {errors.numberPhone && <span className="error-text">{errors.numberPhone}</span>}
          </div>
          
          <div className="form-group">
            <label>Xác nhận lại mật khẩu <span className="required">(*)</span></label>
            <div className="password-input-container">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu" 
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          
          <div className="form-group">
            <label>Email <span className="required">(*)</span></label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email" 
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Địa chỉ <span className="required">(*)</span></label>
            <input 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ" 
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>
          
          <div className="form-group verification">
            <input 
              type="text" 
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              placeholder="Nhập mã xác nhận"  
            />
            <button 
              type="button" 
              className="btn btn-verify"
              onClick={handleResendVerification}
            >
              {isFirstVerification ? "Gửi mã xác nhận" : "Gửi lại mã xác nhận"}
            </button>
            {errors.verificationCode && <span className="error-text">{errors.verificationCode}</span>}
            {errors.verification && <span className="error-text">{errors.verification}</span>}
          </div>
          
          <div className="btn-container">
            <button type="button" className="btn btn-back" onClick={() => navigate("/")}>
              Quay về
            </button>
            <button type="submit" className="btn btn-register">
              Đăng ký tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
