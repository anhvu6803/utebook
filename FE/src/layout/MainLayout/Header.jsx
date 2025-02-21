
import "./styles/Header.scss";
import logo from "../../assets/logoUTE.png"; 

function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </header>
  );
}

export default Header;

