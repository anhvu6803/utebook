import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Book, Wallet, Sparkles } from "lucide-react";
import "./styles/CategoryMenu.scss"; // Import SCSS

const menuItems = [
  { path: '/utebook/novel/Đô thị', label: "Đô thị" },
  { path: "/utebook/novel/Ngôn tình", label: "Ngôn tình" },
  { path: "/utebook/novel/Linh dị", label: "Linh dị" },
  { path: "/utebook/novel/Ma", label: "Truyện ma" },
  { path: "/utebook/novel/Tiên hiệp", label: "Tiên hiệp" },
  { path: "/utebook/novel/Trinh thám", label: "Trinh thám" },
];

const groupIntoFour = (items) => {
  const groups = [[], [], [], []];
  items.forEach((item, index) => {
    groups[index % 3].push(item); // phân tán đều qua 4 nhóm
  });
  return groups;
};

export default function NovelMenu({ active }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLoadLink = (link) => {
    navigate(link);
    window.location.reload();
  };

  return (
    <div
      className="category-container"
      onMouseEnter={() => setIsOpen(true)} // Mở khi di chuột vào
      onMouseLeave={() => setIsOpen(false)} // Đóng khi rời chuột khỏi menu
    >
      <a href="/utebook/novel" className={`category-link ${active ? "active" : ""}`}>
        Sách hoa phượng
      </a>

      <div className={`category-menu ${isOpen ? "active" : ""}`}>
        <div className="menu-header">
          <span> Sách hoa phượng </span>
        </div>
        <div className="menu-grid">
          {groupIntoFour(menuItems).map((group, index) => (
            <ul key={index}>
              {group.map((item, idx) => (
                <li key={idx} onClick={() => handleLoadLink(item.path)}>
                  {item.label}
                </li>
              ))}
            </ul>
          ))}
        </div>
        <div className="menu-footer">
          <div class="menu-header">Khám phá ngay</div>

          <button
            className="menu-btn"
            onClick={() => handleLoadLink("/utebook/newest")}
          >
            <Star size={16} /> Sách mới nhất
          </button>

          <button
            className="menu-btn"
            onClick={() => handleLoadLink("/utebook/free")}>
            <Wallet size={16} /> Sách miễn phí
          </button>
        </div>
      </div>
    </div>
  );
}
