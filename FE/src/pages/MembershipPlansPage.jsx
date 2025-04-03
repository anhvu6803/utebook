import React from "react";
import "./styles/MembershipPlansPage.scss";
import background from "../assets/background.jpg";

const plans = [
  { id: 1, name: "UTEBOOK 3 THÁNG", price: 99000, days: 90, popular: true },
  { id: 2, name: "UTEBOOK 6 THÁNG", price: 179000, days: 183 },
  { id: 3, name: "UTEBOOK 12 THÁNG", price: 329000, days: 365 },
  { id: 4, name: "UTEBOOK 1 THÁNG", price: 39000, days: 30 },
];

const MembershipPlansPage = () => {
  return (
    <>
      <img src={background} alt="background" className="img-backgound"/>

      <div className="membership-container">
        <div className="membership-header ">
          <h2>Gói hội viên</h2>
          <p className="subtitle">Nghe và đọc hàng ngàn nội dung thuộc Kho sách Hội viên</p>
        </div>
        <div className="plans">
          {plans.map((plan) => (
            <div key={plan.id} className={`plan ${plan.popular ? "popular" : ""}`}>
              {plan.popular && <span className="badge">PHỔ BIẾN</span>}
              <h3>{plan.name}</h3>
              <p className="price">{plan.price.toLocaleString()}đ</p>
              <p className="day">{plan.days} ngày đọc/nghe sách</p>
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

export default MembershipPlansPage;
