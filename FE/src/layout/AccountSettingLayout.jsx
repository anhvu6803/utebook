import { Outlet } from "react-router-dom";
import AccountSettingMenu from "../components/AccountSettingMenu";
import "./styles/AccountSettingLayout.scss";

const AccountSettingLayout = () => {
  return (
    <div className="layout-account">
      <AccountSettingMenu className="menu-bar" />
      <main className="content-account">
        <Outlet />
      </main>
    </div>
  );
}

export default AccountSettingLayout;
