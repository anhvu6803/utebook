import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "../pages/styles/LoginPage.scss";
import imgWelcome from "../assets/imgWelcome.png";

const LoginPage = () => {
  const navigate = useNavigate();  

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credentialResponse.credential}`);
      const data = await response.json();
      
      console.log("Google User Info:", {
        email: data.email,
        name: data.name,
        picture: data.picture,
        given_name: data.given_name,
        family_name: data.family_name,
        locale: data.locale,
        email_verified: data.email_verified,
        sub: data.sub 
      });

      
      navigate("/utebook");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
  };

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
