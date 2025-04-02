import "../pages/styles/RegisterPage.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form
    if (!formData.fullname || !formData.email || !formData.password || 
        !formData.confirmPassword || !selectedDate || !formData.numberPhone || 
        !formData.address) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/user/register", {
        username: formData.email.split('@')[0], // Tạo username từ email
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        ngaySinh: selectedDate,
        gioiTinh: formData.gioiTinh,
        numberPhone: formData.numberPhone,
        address: formData.address,
        isGoogleUser: false
      });

      setSuccess("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi đăng ký");
    }
  };

  const handleResendVerification = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/resend-confirmation", {
        email: formData.email
      });
      setSuccess("Đã gửi lại mã xác nhận. Vui lòng kiểm tra email.");
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi gửi lại mã xác nhận");
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <h1>Đăng ký</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên <span className="required">(*)</span></label>
            <input 
              type="text" 
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Nhập họ và tên" 
            />
          </div>
          
          <div className="form-group">
            <label>Ngày tháng năm sinh <span className="required">(*)</span></label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setFormData(prev => ({ ...prev, ngaySinh: date }));
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              className="date-picker"
            />
          </div>

          <div className="form-group">
            <label>Giới tính <span className="required">(*)</span></label>
            <select 
              name="gioiTinh" 
              value={formData.gioiTinh}
              onChange={handleChange}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Mật khẩu <span className="required">(*)</span></label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu" 
            />
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
          </div>
          
          <div className="form-group">
            <label>Xác nhận lại mật khẩu <span className="required">(*)</span></label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu" 
            />
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
              Gửi lại mã xác nhận
            </button>
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
