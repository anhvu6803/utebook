import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/AdminNavbar.scss";
import testAvatar from "../../assets/testAvatar.jpg";

import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";

const menuItems = [
  { name: "Quản lý người dùng", path: "/utebook-admin/", icon: <PeopleIcon /> },
  {
    name: "Quản lý sách",
    icon: <MenuBookIcon />,
    children: [
      { name: "Sách đọc", path: "/utebook-admin/books" },
      { name: "Sách nghe", path: "/utebook-admin/audio-books" },
    ],
  },
  {
    name: "Quản lý thể loại",
    path: "/utebook-admin/categories",
    icon: <CategoryIcon />,
  },
  {
    name: "Quản lý đơn hàng",
    icon: <ReceiptIcon />,
    children: [
      { name: "Tùy chỉnh đơn hàng", path: "/utebook-admin/order" },
      { name: "Lịch sử đơn hàng", path: "/admin/orders/history" },
    ],
  },
  {
    name: "Quản lý khuyến mãi",
    icon: <LocalOfferIcon />,
    children: [
      { name: "Mã giảm giá", path: "/admin/discounts" },
      { name: "Sự kiện", path: "/admin/events" },
    ],
  },
  {
    name: "Thống kê",
    icon: <BarChartIcon />,
    path: "/utebook-admin/statistics",
  },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdowns, setActiveDropdowns] = useState({});
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    let currentItem = "Quản lý người dùng"; 
    let updatedDropdowns = {};

    menuItems.forEach((item) => {
      if (item.path === location.pathname) {
        currentItem = item.name;
      } else if (item.children) {
        const foundChild = item.children.find((child) => child.path === location.pathname);
        if (foundChild) {
          currentItem = foundChild.name;
          updatedDropdowns[item.name] = true;
        }
      }
    });

    setActiveItem(currentItem);
    setActiveDropdowns(updatedDropdowns);
  }, [location.pathname]);

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
      <div className="admin-header-navbar">
        <div className="admin-info">
          <img src={testAvatar} alt="Admin Avatar" className="admin-avatar" />
          <span className="admin-name">Admin</span>
        </div>
      </div>
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.name} className="menu-item">
            <div
              className={`menu-title ${activeItem === item.name && !item.children ? "active" : ""}`}
              onClick={() => (item.children ? toggleDropdown(item.name) : handleLoadLink(item.path, item.name))}
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
