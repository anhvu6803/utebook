import { useNavigate } from "react-router-dom";
import "./styles/HeaderAdmin.scss";
import logo from "../../assets/logoUTE.png"; 
const HeaderAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-header">
      <div className="logo-container" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default HeaderAdmin;
