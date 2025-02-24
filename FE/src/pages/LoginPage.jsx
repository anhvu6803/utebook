import { useNavigate } from "react-router-dom";
import "../pages/styles/LoginPage.scss";
import imgWelcome from "../assets/imgWelcome.png";

const LoginPage = () => {
  const navigate = useNavigate();  

  return (
    <div className="login-page">  
      <div className="container">
        <div className="login-container">
          <div className="login-form">
            <h1>Đăng nhập</h1>
            <form>
              <label>Email <span className="required">(*)</span></label>
              <input type="email" />

              <label>Mật khẩu <span className="required">(*)</span></label>
              <input type="password" />
              
              <div className="forgot-password">
                <a href="#" onClick={(e) => { 
                  e.preventDefault(); 
                  navigate("/forgot-password"); 
                }}>
                  Quên mật khẩu?
                </a>
              </div>
              
              <div className="btn-container">
                <button type="button" className="btn btn-google">
                  Đăng nhập với Google
                </button>
                <button type="button" className="btn btn-login">
                  Đăng nhập
                </button>
              </div>
            </form>
          </div>
          <div className="login-image">
            <img src={imgWelcome} alt="Login illustration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
