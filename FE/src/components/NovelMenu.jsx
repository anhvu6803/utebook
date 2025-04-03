import { useState } from "react";
import { Star, Book, Wallet, Sparkles } from "lucide-react";
import "./styles/CategoryMenu.scss"; // Import SCSS

export default function NovelMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="category-container"
      onMouseEnter={() => setIsOpen(true)} // Mở khi di chuột vào
      onMouseLeave={() => setIsOpen(false)} // Đóng khi rời chuột khỏi menu
    >
      <a href="/utebook/novel" className="category-link">
        Sách truyện 
      </a>

      <div className={`category-menu ${isOpen ? "active" : ""}`}>
        <div className="menu-header">
          <span> Sách truyện </span>
        </div>
        <div className="menu-grid">
          <ul>
            <li>Hiện đại</li>
          </ul>

          <ul>
            <li>Cổ đại </li>
          </ul>

          <ul>
            <li>Huyền huyễn</li>
          </ul>

          <ul>
            <li>Tiên hiệp </li>
          </ul>
        </div>

        <div className="menu-footer">
          <div class="menu-header">Khám phá ngay</div>
          <button className="menu-btn"><Star size={16} /> Sách mới nhất</button>
          <button className="menu-btn"><Book size={16} /> Sách đọc nhiều</button>
          <button className="menu-btn"><Wallet size={16} /> Sách miễn phí</button>
          <button className="menu-btn"><Sparkles size={16} /> Sách đề cử</button>
        </div>
      </div>
    </div>
  );
}
