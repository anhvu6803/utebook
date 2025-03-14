import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import "./styles/AdminLayout.scss"
const AdminLayout = () => {
  return (
    <div className="admin-layout">
        <AdminNavbar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
