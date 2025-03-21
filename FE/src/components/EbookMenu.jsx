import { useState } from "react";
import { Star, Book, ShoppingBag, Wallet, Sparkles } from "lucide-react";
import "./styles/CategoryMenu.scss"; // Import SCSS

export default function EbookMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="category-container"
      onMouseEnter={() => setIsOpen(true)} // Mở khi di chuột vào
      onMouseLeave={() => setIsOpen(false)} // Đóng khi rời chuột khỏi menu
    >
      <a href="#" className="category-link">
        Sách điện tử
      </a>

      <div className={`category-menu ${isOpen ? "active" : ""}`}>
        <div className="menu-header">
          <span> Sách điện tử </span>
        </div>
        <div className="menu-grid">
          <ul>
            <li>Thơ - Tản văn</li>
            <li>Tài chính cá nhân</li>
            <li>Tâm lý - Giới tính</li>
            <li>Chứng khoán - Bất động sản - Đầu tư</li>
            <li>Trinh thám</li>
            <li>Truyện - Tiểu thuyết</li>
          </ul>

          <ul>
            <li>Trinh thám - Kinh dị</li>
            <li>Phát triển cá nhân</li>
            <li>Sức khỏe - Làm đẹp</li>
            <li>Giáo dục - Văn hóa & Xã hội</li>
            <li>Kinh doanh - Làm giàu</li>
            <li>Sách thiếu nhi</li>
          </ul>

          <ul>
            <li>Marketing - Bán hàng</li>
            <li>Doanh nhân - Bài học kinh doanh</li>
            <li>Khoa học - Công nghệ</li>
            <li>Nghệ thuật sống</li>
            <li>Ngôn tình</li>
          </ul>

          <ul>
            <li>Quản trị - Lãnh đạo</li>
            <li>Học tập - Hướng nghiệp</li>
            <li>Tư duy sáng tạo</li>
            <li>Tâm linh - Tôn giáo</li>
            <li>Tác phẩm kinh điển</li>
          </ul>
        </div>

        <div className="menu-footer">
          <div class="menu-header">Khám phá ngay</div>
          <button className="menu-btn"><Star size={16} /> Sách mới nhất</button>
          <button className="menu-btn"><Book size={16} /> Sách đọc nhiều</button>
          <button className="menu-btn"><ShoppingBag size={16} /> Sách mua lẻ</button>
          <button className="menu-btn"><Wallet size={16} /> Sách miễn phí</button>
          <button className="menu-btn"><Sparkles size={16} /> Sách đề cử</button>
        </div>
      </div>
    </div>
  );
}
