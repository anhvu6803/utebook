import "./styles/FooterHome.scss";

const Footer = () => {
  return (
    <div className="footer-container-home">
      <div className="footer-section-home">
        <h2>Về chúng tôi</h2>
        <p>Cung cấp các dịch vụ đọc sách trực tuyến</p>
      </div>
      <div className="footer-section-home">
        <h2>Liên hệ với chúng tôi</h2>
        <p>
          📍
          <a
            href="https://maps.app.goo.gl/agovngfaE6LaN1FF9"
            target="_blank"
            rel="noopener noreferrer"
          >
            HCMC University of Technology and Education
          </a>
        </p>
        <p>
          ✉️
          <a href="mailto:nguyentn0308@gmail.com">nguyentn0308@gmail.com</a>
        </p>
      </div>
    </div>
  );
}

export default Footer;
