import { Outlet } from "react-router-dom";
import "./styles/BookLayout.scss";

const NovelLayout = () => {
  return (
    <div className="layout-book">
      <main className="content-book">
        <Outlet />
      </main>
    </div>
  );
}

export default NovelLayout;
