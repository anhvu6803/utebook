import { useState } from "react";
import { Star, Headphones, ShoppingBag, Wallet, Sparkles } from "lucide-react";
import "./styles/CategoryMenu.scss"; // Import SCSS

export default function AudioMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="category-container"
      onMouseEnter={() => setIsOpen(true)} // Mở khi di chuột vào
      onMouseLeave={() => setIsOpen(false)} // Đóng khi rời chuột khỏi menu
    >
      <a href="/utebook/audio" className="category-link">
        Sách nói
      </a>

      <div className={`category-menu ${isOpen ? "active" : ""}`}>
        <div className="menu-header">
          <span> Sách nói </span>
        </div>
        <div className="menu-grid">
          <ul>
            <li>Giáo dục - Văn hóa & Xã hội</li>
            <li>Địa lý du lịch</li>
            <li>Phát triển cá nhân</li>
            <li>Tâm Lý - Sức Khỏe Tinh Thần</li>
          </ul>

          <ul>
            <li>Tâm linh - Tôn giáo</li>
            <li>Chứng khoán - Bất động sản - Đầu tư</li>
            <li>Sức khỏe - Làm đẹp</li>
            <li>Marketing - Bán hàng</li>
          </ul>

          <ul>
            <li>Sách thiếu nhi</li>
            <li>Trinh thám - Kinh dị</li>
            <li>Truyện - Tiểu thuyết</li>
            <li>Tác phẩm kinh điển</li>
          </ul>

          <ul>
            <li>Ngôn tình</li>
            <li>Viễn tưởng - Giả tưởng</li>
            <li>Học tập - Hướng nghiệp</li>
          </ul>
        </div>

        <div className="menu-footer">
          <div class="menu-header">Khám phá ngay</div>
          <button className="menu-btn"><Star size={16} /> Sách mới nhất</button>
          <button className="menu-btn"><Headphones size={16} /> Sách nghe nhiều</button>
          <button className="menu-btn"><ShoppingBag size={16} /> Sách mua lẻ</button>
          <button className="menu-btn"><Wallet size={16} /> Sách miễn phí</button>
          <button className="menu-btn"><Sparkles size={16} /> Sách đề cử</button>
        </div>
      </div>
    </div>
  );
}
