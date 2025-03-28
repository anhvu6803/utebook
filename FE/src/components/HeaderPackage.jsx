import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./styles/HeaderHome.scss";

import NotificationMenu from "./NotificationMenu";
import UserMenu from "./UserMenu";
import logo from "../assets/logoUTE.png";

import SupportForm from "./SupportForm";
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { Crown } from "lucide-react";

const HeaderPackage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const handleShowForm = (boolean) => {
    setShowForm(boolean);
  }
  const [isShowSearch, SetShowSearch] = useState(false);
  const handleSearchClick = () => {
    SetShowSearch(!isShowSearch);
  }

  const handleLoadLink = (link) => {
    navigate(link);
    window.location.reload();
  }

  return (
    <header className="header-home">
      <div className="header-left">
        <div className="logo-container" onClick={() => handleLoadLink("/utebook")}>
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <nav className="nav-links">
          <a
            className={location.pathname === "/utebook/package-plan" ? "active" : ""}
            href="/utebook/package-plan"
          >
            Gói hội viên
          </a>
          <a className={location.pathname === "/utebook/package-plan/hoa-phuong" ? "active" : ""}
            href="/utebook/package-plan/hoa-phuong"
          >
            Gói hoa phượng
          </a>
          <a className={location.pathname === "/utebook/package-plan/activate-code" ? "active" : ""}
            href="/utebook/package-plan/activate-code"
          >
            Kích hoạt mã code
          </a>
          <SupportForm
            isHeader={true}
            showForm={showForm}
            handleShowForm={handleShowForm}
          />
        </nav>

      </div>

      <div className="header-right">

        {isShowSearch &&
          <motion.input
            className="input"
            type="text"
            placeholder="Tìm kiếm..."
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isShowSearch ? 200 : 0, opacity: isShowSearch ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        }

        <div className="btn-icons">
          <SearchIcon className="icon"
            style={{ fontSize: 30 }}
            onClick={
              handleSearchClick
            } />
          <Button
            className="btn-member"
            variant="outlined"
            startIcon={
              <div style={{ paddingLeft: 5.5 }}>
                <Crown size={13} />
              </div>
            }
            onClick={() => handleLoadLink("/utebook/package-plan")}
          >
            <span style={{ fontSize: 13, fontWeight: 'bold' }}>
              Gói cước
            </span>
          </Button>
          <NotificationMenu />
        </div>



        <div className="avatar-container">
          <UserMenu />
        </div>
      </div>

    </header>
  );
};

export default HeaderPackage;
