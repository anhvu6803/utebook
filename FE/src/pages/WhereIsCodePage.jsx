import React from "react";
import "./styles/WhereIsCodePage.scss";
import background3 from "../assets/background3.jpg";

const WhereIsCodePage = () => {

  return (
    <>
      <img src={background3} alt="background" />

      <div className="where-code-container">
        <div className="where-code-header ">
          <h2>Nhận mã kích hoạt ở đâu?</h2>
          <p className="subtitle">Nhập ngay để nhận gói Hội viên UTEBOOK và sách lẻ</p>
        </div>
        <div className="infor-container">
          <p>1. Mã khuyến mại là mã quà tặng UTEBOOK gửi đến độc giả trong các chương trình tri ân dùng để mua lẻ ebook, mua gói Hội viên hoặc thêm ngày sử dụng ngày Hội viên trên UTEBOOK.</p>
          <p>2. Nhận mã khuyến mại ở đâu?
            <p>
              Mã khuyến mại sẽ được UTEBOOK phát ra trong các chương trình như: các ngày lễ lớn (2/9, 30/4, 20/11, 14/2. tết dương lịch, tết âm lịch,..), các chương trình kỷ niệm (Ngày sách Việt Nam, sinh nhật UTEBOOK,...). Ngoài ra Độc giả cũng có thể nhận mã khuyến mại khi tích trử lượng lá hoa phượng nhất định.
            </p>
          </p>

          <p>
            Hãy thường xuyên vào UTEBOOK để cập nhật nhanh nhất các chương trình tri ân của UTEBOOK dành cho độc giả nhé các bạn!
          </p>
        </div>

      </div>
    </>
  );
};

export default WhereIsCodePage;
