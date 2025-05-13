import React, { useState, useEffect } from "react";
import "./styles/HoaPhuongPage.scss";
import background2 from "../assets/background2.jpg";
import hoaPhuong from "../assets/hoaPhuong.png";
import { Leaf } from "lucide-react";
import axios from "../utils/axios";
import PaymentMethodModal from "../components/PaymentMethodModal";

const HoaPhuongPage = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/point-packages');
        if (response.data) {
          setPlans(response.data);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPlans();
  }, []);

  const handleBuyPlan = (plan) => {
    setSelectedPlan(plan);
    setOpenPaymentModal(true);
  };

  const handlePaymentMethodSelect = async (paymentMethod) => {
    try {
      setLoading(true);
      const response = await axios.post('/payment/create', {
        packageId: selectedPlan._id,
        typePackage: 'point',
        amount: selectedPlan.price,
        paymentMethod
      });

      if (response.data.success) {
        window.location.href = response.data.data.paymentUrl;
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      setOpenPaymentModal(false);
    }
  };

  if (error) return <div>Có lỗi xảy ra: {error}</div>;

  return (
    <>
      <img src={background2} alt="background" className="img-backgound"/>

      <div className="hoaphuong-container">
        <div className="hoaphuong-header">
          <h2>Hoa Phượng</h2>
          <p className="subtitle">Đọc toàn bộ nội dung thuộc kho sách UTEBOOK (không bao gồm sách Hội viên)</p>
          <p className="subtitle" style={{ marginBottom: "30px" }}>Nạp càng nhiều, khuyến mãi càng lớn</p>
        </div>
        <p className="title-plans">Chọn gói hoa phượng muốn nạp</p>
        <div className="plans-hoaphuong">
          {plans.map((plan) => (
            <div key={plan._id} className={`plan ${plan.popular ? "popular" : ""}`}>
              {plan.popular && <span className="badge">PHỔ BIẾN</span>}
              <div className="header-plan">
                <img src={hoaPhuong} alt="hoaPhuong" className="icon-header" />
                <h3>{plan.name}</h3>
                <p className="sub-header">Khuyến mãi kênh thanh toán tới</p>
                <div className="value-container">
                  <span className="value-item">
                    <img src={hoaPhuong} className="hoaphuong-img" />
                    <p className="hoaphuong-p">{plan.quantity_HoaPhuong.toLocaleString('vi-VN')}</p>
                  </span>
                  <span className="value-item">
                    <Leaf />
                    <p className="leaf-p">{plan.quantity_La.toLocaleString('vi-VN')}</p>
                  </span>
                </div>
              </div>
              <p className="price">{plan.price.toLocaleString()}đ</p>
              <button 
                className="buy-button"
                onClick={() => handleBuyPlan(plan)}
              >
                <span style={{ fontSize: 14, fontWeight: 500 }}>Mua gói</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <PaymentMethodModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        onConfirm={handlePaymentMethodSelect}
        loading={loading}
      />
    </>
  );
};

export default HoaPhuongPage;
