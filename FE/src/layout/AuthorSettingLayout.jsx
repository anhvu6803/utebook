import { Outlet } from "react-router-dom";
import AccountSettingMenu from "../components/AccountSettingMenu";
import "./styles/AuthorSettingLayout.scss";

const AuthorSettingLayout = () => {
  return (
    <div className="layout-author">
      <AccountSettingMenu className="menu-bar" />
      <main className="content-account">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthorSettingLayout;
