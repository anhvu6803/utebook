import { useNavigate } from "react-router-dom"; 
import "../pages/styles/WelcomePage.scss";
import imgWelcome from "../assets/imgWelcome.png";  

const WelcomePage = () => {
  const navigate = useNavigate();  

  return (
    <div className="welcome-container">
      <div className="welcome-text">
        <h1>Trang web đọc sách trực tuyến</h1>
        <div className="buttons">
          <button className="btn btn-register" onClick={()=> navigate("/register")}>Đăng kí</button>
          <button className="btn btn-login" onClick={() => navigate("/login")}>
            Đăng nhập
          </button>
        </div>
      </div>
      <div className="welcome-image">
        <img src={imgWelcome} alt="Welcome" />
      </div>
    </div>
  );
};

export default WelcomePage;
