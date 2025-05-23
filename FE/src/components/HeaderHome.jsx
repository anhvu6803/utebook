import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./styles/HeaderHome.scss";

import EbookMenu from "./EbookMenu";
import AudioMenu from "./AudioMenu";
import NovelMenu from "./NovelMenu";
import PodcastMenu from "./PodcastMenu";
import NotificationMenu from "./NotificationMenu";
import UserMenu from "./UserMenu";
import logo from "../assets/logoUTE.png";

import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { Crown } from "lucide-react";
import { bool } from "prop-types";

const HeaderHome = () => {
  const navigate = useNavigate();

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
          <EbookMenu />
          <AudioMenu />
          <NovelMenu />
          <PodcastMenu />
          <a href="/utebook/creative">Sáng tác</a>
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

export default HeaderHome;
