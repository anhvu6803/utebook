import { Outlet } from "react-router-dom";
import AuthorSettingMenu from "../components/AuthorSettingMenu";
import "./styles/AuthorSettingLayout.scss";

const AuthorSettingLayout = () => {
  return (
    <div className="layout-author">
      <AuthorSettingMenu className="menu-bar" />
      <main className="content-account">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthorSettingLayout;
