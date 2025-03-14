import { useState } from "react";
import "./styles/CheckoutPage.scss";

// Dữ liệu giả lập
const userInfo = {
  name: "AnhVu",
  email: "anhvu@gmail.com",
  phone: "0343167043",
};

const orderItems = [
  { id: 1, name: "Muôn kiếp nhân sinh 2", price: 100000, image: "book1.jpg" },
  { id: 2, name: "Muôn kiếp nhân sinh 2", price: 100000, image: "book1.jpg" },
  { id: 3, name: "Muôn kiếp nhân sinh 2", price: 100000, image: "book1.jpg" },
];

const paymentOptions = [
  {
    id: "momo",
    label: "Thanh toán qua MoMo",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/3b/MoMo_Logo.png",
  },
  {
    id: "credit-card",
    label: "Thanh toán qua thẻ tín dụng",
    img: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
  },
];

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("momo");

  // Tính tổng tiền
  const totalPrice = orderItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Thanh toán</h2>

      {/* Thông tin người dùng */}
      <div className="user-info">
        <h3>Thông tin người dùng</h3>
        <p><strong>Tên người dùng:</strong> {userInfo.name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Số điện thoại:</strong> {userInfo.phone}</p>
      </div>

      {/* Thông tin đơn hàng */}
      <div className="order-info">
        <h3>Thông tin đơn hàng</h3>
        {orderItems.map((item) => (
          <div key={item.id} className="order-item">
            <img src={item.image} alt={item.name} className="order-image" />
            <div>
              <p>{item.name}</p>
              <p><strong>Giá:</strong> {item.price.toLocaleString()} VND</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tổng tiền */}
      <div className="total-price">
        <strong>Thành tiền:</strong> <span>{totalPrice.toLocaleString()} VND</span>
      </div>

      {/* Phương thức thanh toán */}
      <div className="payment-method">
        <h3>Phương thức thanh toán</h3>
        {paymentOptions.map((option) => (
          <label key={option.id} className="payment-option">
            <input
              type="radio"
              name="payment"
              value={option.id}
              checked={paymentMethod === option.id}
              onChange={() => setPaymentMethod(option.id)}
            />
            <img src={option.img} alt={option.label} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      {/* Nút thanh toán */}
      <button className="checkout-button">Thanh toán</button>
    </div>
  );
};

export default Checkout;
