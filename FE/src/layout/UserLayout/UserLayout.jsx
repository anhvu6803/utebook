import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./styles/UserLayout.scss";

const UserLayout = () => {
  return (
    <div className="user-layout">
      <Navbar />
      <main className="user-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
