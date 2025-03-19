import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import HeaderAdmin from "../../components/Admin/HeaderAdmin";
import "./styles/AdminLayout.scss";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <div className="admin-body">
      <div className="admin-header">
          <HeaderAdmin />
      </div>
        <div className="admin-navbar">
          <AdminNavbar />
        </div>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
