import "../pages/styles/RegisterPage.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const RegisterPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="register-page">
      <div className="container">
        <h1>Đăng kí</h1>
        <form className="register-form">
          <div className="form-group">
            <label>Họ và tên <span className="required">(*)</span></label>
            <input type="text" placeholder="Nhập họ và tên" />
          </div>
          
          <div className="form-group">
            <label>Ngày tháng năm sinh <span className="required">(*)</span></label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              className="date-picker"
            />
          </div>
          
          <div className="form-group">
            <label>Mật khẩu <span className="required">(*)</span></label>
            <input type="password" placeholder="Nhập mật khẩu" />
          </div>
          
          <div className="form-group">
            <label>Số điện thoại liên hệ <span className="required">(*)</span></label>
            <input type="tel" placeholder="Nhập số điện thoại" />
          </div>
          
          <div className="form-group">
            <label>Xác nhận lại mật khẩu <span className="required">(*)</span></label>
            <input type="password" placeholder="Nhập lại mật khẩu" />
          </div>
          
          <div className="form-group">
            <label>Email <span className="required">(*)</span></label>
            <input type="email" placeholder="Nhập email" />
          </div>
          
          <div className="form-group verification">
            <input type="text" placeholder="Nhập mã xác nhận"  />
            <button type="button" className="btn btn-verify">Lấy mã xác nhận</button>
          </div>
          
          <div className="btn-container">
            <button type="button" className="btn btn-back" onClick={() => navigate("/") }>Quay về</button>
            <button type="submit" className="btn btn-register">Đăng kí tài khoản</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
