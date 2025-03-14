import "./styles/CartPage.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Muôn kiếp nhân sinh 2", price: 100000, img: "image_url" },
    { id: 2, name: "Đắc nhân tâm", price: 120000, img: "image_url" },
    { id: 3, name: "Nhà giả kim", price: 95000, img: "image_url" },
  ]);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="cart-container">
      <h2>🛒 Giỏ hàng ({cartItems.length} sản phẩm)</h2>
      {cartItems.length > 0 && (
         <span className="delete-all-text" onClick={handleClearCart}>
         Xóa tất cả
       </span>
      )}
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.img} alt={item.name} className="cart-item-image" />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>Giá: {item.price.toLocaleString()} VND</p>
            </div>
            <button className="delete-btn" onClick={() => handleRemove(item.id)}>
              <DeleteIcon />
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p>
          <strong>Thành tiền:</strong>{" "}
          {cartItems.reduce((total, item) => total + item.price, 0).toLocaleString()} VND
        </p>
        <button className="checkout-btn" onClick={()=> navigate("/checkout")}>Thanh toán</button>
      </div>
    </div>
  );
};

export default Cart;
