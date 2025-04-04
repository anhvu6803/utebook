import React, { useState } from "react";
import "./styles/ActivateCodePage.scss";
import background3 from "../assets/background3.jpg";

const ActivateCodePage = () => {
  const [code, setCode] = useState("");

  return (
    <>
      <img src={background3} alt="background" className="img-backgound"/>

      <div className="activate-code-container">
        <div className="activate-code-header ">
          <h2>Kích hoạt mã Code</h2>
          <p className="subtitle">Nhập ngay để nhận gói Hội viên UTEBOOK và sách lẻ</p>
        </div>
        <div className=" activate-code-content">
          <div className="input-container">
            <div className="actions-container">
              <div class="input-container-outline">
                <label for="code">Nhập mã code</label>
                <input type="text" id="code" value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <button disabled={code.length === 0}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>Kích hoạt ngay</p>
              </button>
            </div>
            <div className="rule-container">
              <strong>Lưu ý</strong>
              <p>1. Các ký tự có thể nhầm lẫn: 0/O, l/L, 5/S, 1/l</p>
              <p>2. Thời gian hết hạn được tính từ ngày kích hoạt mã</p>
              <p>3. Nhận mã này ở đâu?
                <a className="link" href="thong-tin/nhan-ma-khuyen-mai">
                  {' '} Tìm hiểu thêm
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivateCodePage;
