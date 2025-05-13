import React, { useState, useEffect } from "react";
import "./styles/MembershipPlansPage.scss";
import background from "../assets/background.jpg";
import axios from "../utils/axios";
import PaymentMethodModal from "../components/PaymentMethodModal";

const MembershipPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/membership-packages');
        if (response.data.success) {
          setPlans(response.data.data);
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
        typePackage: 'membership',
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
      <img src={background} alt="background" className="img-backgound"/>

      <div className="membership-container">
        <div className="membership-header">
          <h2>Gói hội viên</h2>
          <p className="subtitle">Nghe và đọc hàng ngàn nội dung thuộc Kho sách Hội viên</p>
        </div>
        <div className="plans">
          {plans.map((plan) => (
            <div key={plan._id} className={`plan ${plan.popular ? "popular" : ""}`}>
              {plan.popular && <span className="badge">PHỔ BIẾN</span>}
              <h3>{plan.name}</h3>
              <p className="price">{plan.price.toLocaleString()}đ</p>
              <p className="day">{plan.expire} ngày đọc/nghe sách</p>
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

export default MembershipPlansPage;
