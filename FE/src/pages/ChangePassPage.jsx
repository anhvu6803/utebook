import "../pages/styles/ChangePassPage.scss";
import imgWelcome from "../assets/imgWelcome.png";

const ChangePasswordPage = () => {
  return (
    <div className="change-password-page">
      <div className="container">
        <div className="change-password-container">
          <div className="change-password-form">
            <h1>Thay đổi mật khẩu mới</h1>
            <form>
              <label>Mật khẩu mới <span className="required">(*)</span></label>
              <input type="password" placeholder="Nhập mật khẩu mới" />

              <label>Nhập lại mật khẩu mới <span className="required">(*)</span></label>
              <input type="password" placeholder="Nhập lại mật khẩu mới" />

              <div className="btn-container">
                <button type="submit" className="btn btn-update">Cập nhật mật khẩu</button>
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