import { useNavigate } from "react-router-dom";
import logo from "../assets/logoUTE.png";
import { useState } from "react";
import { Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./styles/Navbar.scss";
const Navbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${search}`);
    }
  };

  return (
    <header className="navbar">
      <div className="logo-container" onClick={() => navigate("/")}> 
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <nav className="nav-links">
        <span onClick={() => navigate("/book")}>Sách đọc</span>
        <span onClick={() => navigate("/confession")}>Diễn đàn</span>
        <span onClick={() => navigate("/cart")}>Giỏ hàng</span>
      </nav>
      <div className="search-user-container">
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">
            <SearchIcon />
          </button>
        </form>
        <Avatar className="user-avatar" />
      </div>
    </header>
  );
};

export default Navbar;
