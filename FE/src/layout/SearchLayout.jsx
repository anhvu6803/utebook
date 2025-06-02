import { Outlet } from "react-router-dom";
import "./styles/SearchLayout.scss";

const SearchLayout = () => {
  return (
    <div className="layout-search">
      <main className="content-search">
        <Outlet />
      </main>
    </div>
  );
}

export default SearchLayout;
