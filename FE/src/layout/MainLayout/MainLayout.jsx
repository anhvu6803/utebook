import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./styles/MainLayout.scss";

function MainLayout() {
  return (
    <div className="layout">
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
