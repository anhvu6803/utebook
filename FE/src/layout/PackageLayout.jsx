import { Outlet } from "react-router-dom";
import HeaderPackage from "../components/HeaderPackage.jsx";
import FooterHome from "../components/FooterHome.jsx";
import "./styles/HomeLayout.scss";

const HomeLayout = () => {
  return (
    <div className="layout-home">
      <HeaderPackage className="header-home" />
      <main className="content-home">
        <Outlet />
      </main>
      <FooterHome className="footer-home" />
    </div>
  );
}

export default HomeLayout;
