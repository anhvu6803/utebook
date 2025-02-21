import "../pages/WelcomePage.scss"
import imgWelcome from "../assets/imgWelcome.png"  
function WelcomePage() {
  return (
    <div className="welcome-container">
      <div className="welcome-text">
        <h1>Trang web đọc sách trực tuyến</h1>
        <div className="buttons">
          <button className="btn btn-register">Đăng kí</button>
          <button className="btn btn-login">Đăng nhập</button>
        </div>
      </div>
      <div className="welcome-image">
        <img src={imgWelcome} />
      </div>
    </div>
  );
}

export default WelcomePage;
