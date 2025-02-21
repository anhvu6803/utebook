import "./styles/Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>Về chúng tôi</h2>
          <p>Cung cấp các dịch vụ đọc sách trực tuyến</p>
        </div>
        <div className="footer-section">
          <h2>Liên hệ với chúng tôi</h2>
          <p>
            📍 
            <a
              href="https://www.google.com/maps/search/?api=1&query=Số+1,+Võ+Văn+Ngân,+Thủ+Đức"
              target="_blank"
              rel="noopener noreferrer"
            >
              Số 1, Võ Văn Ngân, Thủ Đức, TP Hồ Chí Minh
            </a>
          </p>
          <p>
            ✉️ 
            <a href="mailto:nguyentn0308@gmail.com">nguyentn0308@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
