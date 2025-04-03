import { Outlet } from "react-router-dom";
import "./styles/BookLayout.scss";

const AudioLayout = () => {
  return (
    <div className="layout-book">
      <main className="content-book">
        <Outlet />
      </main>
    </div>
  );
}

export default AudioLayout;
