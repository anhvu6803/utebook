import { Outlet } from "react-router-dom";
import HeaderHome from "../components/HeaderHome.jsx";
import FooterHome from "../components/FooterHome.jsx";
import "./styles/HomeLayout.scss";
const HomeLayout = () => {
  return (
    <div className="layout-home">
      <HeaderHome className="header-home" />
      <main className="content-home">
        <Outlet />
      </main>
      <FooterHome className="footer-home" />
    </div>
  );
}

export default HomeLayout;
