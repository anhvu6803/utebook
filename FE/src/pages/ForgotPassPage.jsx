import "../pages/styles/ForgotPassPage.scss";
import imgWelcome from "../assets/imgWelcome.png";   

const ForgotPasswordPage = () => {
  return (
    <div className="forgot-password-page">
      <div className="container">
        <div className="forgot-password-container">
          <div className="forgot-password-form">
            <h1>Quên mật khẩu</h1>
            <form>
              <label>Email đăng kí tài khoản <span className="required">(*)</span></label>
              <input type="email" placeholder="Nhập email của bạn" />

              <div className="btn-container">
                <button type="submit" className="btn btn-reset">Lấy lại mật khẩu</button>
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
