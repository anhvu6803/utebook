import { useNavigate } from "react-router-dom";
import "./styles/Header.scss";
import logo from "../assets/logoUTE.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo-container" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </header>
  );
};

export default Header;
