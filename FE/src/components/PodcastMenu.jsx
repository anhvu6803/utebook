import { useState } from "react";
import { Star, Podcast, Disc3 } from "lucide-react";
import "./styles/CategoryMenu.scss"; // Import SCSS

export default function PodcastMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="category-container"
      onMouseEnter={() => setIsOpen(true)} // Mở khi di chuột vào
      onMouseLeave={() => setIsOpen(false)} // Đóng khi rời chuột khỏi menu
    >
      <a href="#" className="category-link">
        Podcast
      </a>

      <div className={`category-menu ${isOpen ? "active" : ""}`}>
        <div className="menu-header">
          <span> Podcast </span>
        </div>
        <div className="menu-grid">
          <ul>
            <li>Tâm lý - Chữa lành</li>
            <li>Ngoài văn học</li>
          </ul>

          <ul>
            <li>Khoa học - Công nghệ </li>
            <li>Phật giáo - Tâm linh</li>
          </ul>

          <ul>
            <li>Văn hóa - Lịch sử</li>
            <li>Văn học</li>
          </ul>

          <ul>
            <li>Podcast thanh niên </li>
          </ul>
        </div>

        <div className="menu-footer">
          <div class="menu-header">Khám phá ngay</div>
          <button className="menu-btn"><Podcast size={16} /> Podcast nghe nhiều</button>
          <button className="menu-btn"><Star size={16} /> Mới nhất</button>
          <button className="menu-btn"><Disc3 size={16} /> Tập mới lên </button>
        </div>
      </div>
    </div>
  );
}
