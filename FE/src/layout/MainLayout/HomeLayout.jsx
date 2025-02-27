import { Outlet } from "react-router-dom";
import HeaderHome from "../../components/HeaderHome.jsx";
import Footer from "../../components/Footer.jsx";
import "./styles/HomeLayout.scss";

const HomeLayout =() => {
  return (
    <div className="layout">
      <HeaderHome />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default HomeLayout;
