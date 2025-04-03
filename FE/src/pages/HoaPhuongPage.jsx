import React from "react";
import "./styles/HoaPhuongPage.scss";
import background2 from "../assets/background2.jpg";
import hoaPhuong from "../assets/hoaPhuong.png";

import { Leaf } from "lucide-react";

const plans = [
  { id: 1, name: "Gói Hạt Sồi 399k", price: 399000, hoaPhuong: 18550, leaf: 200, popular: true },
  { id: 2, name: "Gói Hạt Sồi 499k", price: 499000, hoaPhuong: 23550, leaf: 250 },
  { id: 3, name: "Gói Hạt Sồi 599k", price: 599000, hoaPhuong: 28050, leaf: 300 },
  { id: 4, name: "Gói Hạt Sồi 79k", price: 79000, hoaPhuong: 3550, leaf: 40 },
  { id: 5, name: "Gói Hạt Sồi 129k", price: 129000, hoaPhuong: 6050, leaf: 65 },
  { id: 6, name: "Gói Hạt Sồi 199k", price: 199000, hoaPhuong: 9050, leaf: 100 },
  { id: 7, name: "Gói Hạt Sồi 299k", price: 299000, hoaPhuong: 14050, leaf: 150 },
  { id: 8, name: "Gói Hạt Sồi 999k", price: 999000, hoaPhuong: 50050, leaf: 500 }
];

const HoaPhuongPage = () => {
  return (
    <>
      <img src={background2} alt="background" className="img-backgound"/>

      <div className="hoaphuong-container">
        <div className="hoaphuong-header ">
          <h2>Hoa Phượng</h2>
          <p className="subtitle">Đọc toàn bộ nội dung thuộc kho sách UTEBOOK (không bao gồm sách Hội viên)</p>
          <p className="subtitle" style={{ marginBottom: "30px" }}>  Nạp càng nhiều, khuyến mãi càng lớn</p>
        </div>
        <p className="title-plans">Chọn gói hoa phượng muốn nạp</p>
        <div className="plans-hoaphuong">
          {plans.map((plan) => (
            <div key={plan.id} className={`plan ${plan.popular ? "popular" : ""}`}>
              {plan.popular && <span className="badge">PHỔ BIẾN</span>}
              <div className="header-plan">
                <img src={hoaPhuong} alt="hoaPhuong" className="icon-header" />
                <h3>{plan.name}</h3>
                <p className="sub-header">Khuyến mãi kênh thanh toán tới</p>
                <div className="value-container">
                  <span className="value-item">
                    <img src={hoaPhuong} className="hoaphuong-img" />
                    <p className="hoaphuong-p">{(plan.hoaPhuong).toLocaleString('vi-VN')}</p>
                  </span>
                  <span className="value-item">
                    <Leaf />
                    <p className="leaf-p">{(plan.leaf).toLocaleString('vi-VN')}</p>
                  </span>
                </div>
              </div>
              <p className="price">{plan.price.toLocaleString()}đ</p>
              <button className="buy-button">
                <span style={{ fontSize: 14, fontWeight: 500 }}>Mua gói</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HoaPhuongPage;
