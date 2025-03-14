import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Layers, Book, Package, BarChart } from "lucide-react";
import "./styles/AdminNavbar.scss";
import logo from "../../assets/logoUTE.png";

const Navbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <img src={logo} alt="Admin Logo" />
        </div>

        {/* Danh sách menu */}
        <ul className="nav-links">
          <li className="nav-item-container">
            <Link
              to="/admin/users"
              className={`nav-item ${activeTab === "/admin/users" ? "active" : ""}`}
              onClick={() => setActiveTab("/admin/users")}
            >
              <Users size={20} /> <span>Quản lý người dùng</span>
            </Link>
          </li>
          <li className="nav-item-container">
            <Link
              to="/admin/categories"
              className={`nav-item ${activeTab === "/admin/categories" ? "active" : ""}`}
              onClick={() => setActiveTab("/admin/categories")}
            >
              <Layers size={20} /> <span>Quản lý danh mục</span>
            </Link>
          </li>
          <li className="nav-item-container">
            <Link
              to="/admin/books"
              className={`nav-item ${activeTab === "/admin/books" ? "active" : ""}`}
              onClick={() => setActiveTab("/admin/books")}
            >
              <Book size={20} /> <span>Quản lý sách</span>
            </Link>
          </li>
          <li className="nav-item-container">
            <Link
              to="/admin/orders"
              className={`nav-item ${activeTab === "/admin/orders" ? "active" : ""}`}
              onClick={() => setActiveTab("/admin/orders")}
            >
              <Package size={20} /> <span>Quản lý đơn hàng</span>
            </Link>
          </li>
          <li className="nav-item-container">
            <Link
              to="/admin/statistics"
              className={`nav-item ${activeTab === "/admin/statistics" ? "active" : ""}`}
              onClick={() => setActiveTab("/admin/statistics")}
            >
              <BarChart size={20} /> <span>Thống kê</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
