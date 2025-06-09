import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import "../pages/styles/LoginPage.scss";
import imgWelcome from "../assets/imgWelcome.png";
import { useAuth } from '../contexts/AuthContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const LoginPage = () => {
  const navigate = useNavigate();  
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      // Cập nhật trạng thái user với đầy đủ thông tin
      const userData = {
        ...data.user,
        email: data.user.email,
        userId: data.user._id,
        isAdmin: data.user.role === 'admin'
      };
      setUser(userData);

      // Chuyển hướng đến trang chủ
      navigate("/utebook");
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      // Verify token với Google
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credentialResponse.credential}`);
      const data = await response.json();
      
      // Gửi thông tin người dùng lên server
      const serverResponse = await fetch("http://localhost:5000/api/auth/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          picture: data.picture,
          googleId: data.sub
        })
      });

      const serverData = await serverResponse.json();

      if (!serverResponse.ok) {
        throw new Error(serverData.message || "Đăng nhập với Google thất bại");
      }

      // Cập nhật trạng thái user với đầy đủ thông tin
      const userData = {
        ...serverData.user,
        email: serverData.user.email,
        userId: serverData.user._id,
        isAdmin: serverData.user.role === 'admin'
      };
      setUser(userData);

      // Chuyển hướng đến trang chủ
      navigate("/utebook");
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message);
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
    setError("Đăng nhập với Google thất bại");
  };

  return (
    <div className="login-page">  
        <div className="login-container">
          <div className="login-form">
            <div className="form-header">
              <h1>Chào mừng trở lại!</h1>
              <p>Đăng nhập để tiếp tục trải nghiệm</p>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email <span className="required">(*)</span></label>
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu <span className="required">(*)</span></label>
                <div className="password-input-container">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Nhập mật khẩu của bạn"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
              </div>
              
              <div className="form-options">
                <div className="remember-me">
                </div>
                <a 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    navigate("/forgot-password"); 
                  }}
                  className="forgot-password"
                >
                  Quên mật khẩu?
                </a>
              </div>
              
              <div className="btn-container">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    theme="filled_blue"
                    locale="vi"
                    text="Đăng nhập với Google"
                    shape="rectangular"
                    size="large"
                    width="100%"
                    style={{
                      backgroundColor: '#4285f4',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      boxShadow: '0 2px 4px rgba(66, 133, 244, 0.2)',
                      transition: 'all 0.3s ease',
                      height: '48px',
                      padding: '0 24px',
                      '&:hover': {
                        backgroundColor: '#357abd',
                        boxShadow: '0 4px 8px rgba(66, 133, 244, 0.3)',
                        transform: 'translateY(-1px)'
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                        backgroundColor: '#2b6cb0'
                      }
                    }}
                  />
                </GoogleOAuthProvider>
                <div className="divider">
                  <span>hoặc</span>
                </div>
                <button type="submit" className="btn btn-login">
                  Đăng nhập
                </button>
              </div>

              <div className="register-link">
                Chưa có tài khoản? 
                <a href="#" onClick={(e) => { 
                  e.preventDefault(); 
                  navigate("/register"); 
                }}>
                  Đăng ký ngay
                </a>
              </div>
            </form>
          </div>
          <div className="login-image">
            <img src={imgWelcome} alt="Login illustration" />
          </div>
        </div>
      </div>
  );
};

export default LoginPage;
