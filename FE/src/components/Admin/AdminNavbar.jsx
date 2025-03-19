import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AdminNavbar.scss"; // Import SCSS
import testAvatar from "../../assets/testAvatar.jpg";

import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";

const menuItems = [
  {
    name: "Quản lý người dùng",
    path: "/utebook-admin/",
    icon: <PeopleIcon />,
  },
  {
    name: "Quản lý sách",
    icon: <MenuBookIcon />,
    children: [
      { name: "Sách đọc", path: "/admin/books/reading" },
      { name: "Sách nghe", path: "/utebook-admin/" },
    ],
  },
  {
    name: "Quản lý thể loại",
    icon: <CategoryIcon />,
    children: [
      { name: "Thể loại sách đọc", path: "/utebook-admin/" },
      { name: "Thể loại sách nghe", path: "/admin/categories/audio" },
    ],
  },
  {
    name: "Quản lý đơn hàng",
    icon: <ReceiptIcon />,
    children: [
      { name: "Tùy chỉnh đơn hàng", path: "/admin/orders/manage" },
      { name: "Lịch sử đơn hàng", path: "/admin/orders/history" },
    ],
  },
  {
    name: "Thống kê",
    icon: <BarChartIcon />,
    children: [
      { name: "Số lượng hội viên", path: "/admin/statistics/members" },
      { name: "Doanh số bán sách", path: "/admin/statistics/sales" },
      { name: "Doanh thu", path: "/admin/statistics/revenue" },
    ],
  },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [activeDropdowns, setActiveDropdowns] = useState({});
  const [activeItem, setActiveItem] = useState(null); // Lưu mục active

  const handleLoadLink = (path, itemName) => {
    setActiveItem(itemName);
    navigate(path);
  };

  const toggleDropdown = (itemName) => {
    setActiveDropdowns((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  return (
    <div className="admin-menu">
      {/* Header */}
      <div className="admin-header-navbar">
        <div className="admin-info">
          <img src={testAvatar} alt="Admin Avatar" className="admin-avatar" />
          <span className="admin-name">Admin</span>
        </div>
      </div>

      {/* Menu */}
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.name} className="menu-item">
            <div
              className={`menu-title ${activeItem === item.name ? "active" : ""}`}
              onClick={() =>
                item.children ? toggleDropdown(item.name) : handleLoadLink(item.path, item.name)
              }
            >
              <div className="menu-icon">{item.icon}</div>
              <span>{item.name}</span>
              {item.children && (
                <ExpandMoreIcon className={`dropdown-icon ${activeDropdowns[item.name] ? "rotated" : ""}`} />
              )}
            </div>

            {item.children && (
              <ul className={`dropdown ${activeDropdowns[item.name] ? "show" : ""}`}>
                {item.children.map((child) => (
                  <li
                    key={child.name}
                    className={activeItem === child.name ? "active" : ""}
                    onClick={() => handleLoadLink(child.path, child.name)}
                  >
                    {child.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
        <li className="menu-item logout" onClick={() => handleLoadLink("/logout", "Đăng xuất")}>
          <div className="menu-icon"><LogoutIcon /></div>
          <span>Đăng xuất</span>
        </li>
      </ul>
    </div>
  );
};

export default AdminNavbar;
