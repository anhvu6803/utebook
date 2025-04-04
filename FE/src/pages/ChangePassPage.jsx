import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../pages/styles/ChangePassPage.scss";
import imgWelcome from "../assets/imgWelcome.png";
import axios from "axios";
import { toast } from "react-toastify";

const ChangePasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid reset link");
      navigate("/forgot-password");
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = searchParams.get("token");

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/user/reset-password", {
        token,
        newPassword: formData.newPassword
      });
      toast.success("Đổi mật khẩu thành công");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="container">
        <div className="change-password-container">
          <div className="change-password-form">
            <h1>Thay đổi mật khẩu mới</h1>
            <form onSubmit={handleSubmit}>
              <label>Mật khẩu mới <span className="required">(*)</span></label>
              <input 
                type="password" 
                name="newPassword"
                placeholder="Nhập mật khẩu mới" 
                value={formData.newPassword}
                onChange={handleChange}
                required
              />

              <label>Nhập lại mật khẩu mới <span className="required">(*)</span></label>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu mới" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <div className="btn-container">
                <button 
                  type="submit" 
                  className="btn btn-update"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                </button>
              </div>
            </form>
          </div>
          <div className="change-password-image">
            <img src={imgWelcome} alt="Change Password illustration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;