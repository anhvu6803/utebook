import { useState } from "react";
import "../pages/styles/ForgotPassPage.scss";
import imgWelcome from "../assets/imgWelcome.png";   
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post("http://localhost:5000/api/user/request-password-reset", { email });
      toast.success("Mã xác nhận đã được gửi đến email của bạn");
    } catch (error) {
      toast.error(error.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="container">
        <div className="forgot-password-container">
          <div className="forgot-password-form">
            <h1>Quên mật khẩu</h1>
            <form onSubmit={handleSubmit}>
              <label>Email đăng kí tài khoản <span className="required">(*)</span></label>
              <input 
                type="email" 
                placeholder="Nhập email của bạn" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="btn-container">
                <button 
                  type="submit" 
                  className="btn btn-reset"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang gửi..." : "Lấy lại mật khẩu"}
                </button>
              </div>
            </form>
          </div>
          <div className="forgot-password-image">
            <img src={imgWelcome} alt="Forgot Password illustration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
