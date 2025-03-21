import React, { useState } from "react";
import "./styles/OrderDisplay.scss";

import emptyOrder from "../assets/emptyOrder.png";
import { MessageCircle } from "lucide-react";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';

const ItemStatus = ["Chờ xác nhận", "Đang giao hàng", "Đã giao", "Đã hủy", "Giao hàng không thành công"];

const OrderDisplay = ({ itemData }) => {
    const [searchText, setSearchText] = useState("");

    return (
        <div className="order-card-container">
            {itemData.length > 0 ? (
                <div >
                    <TextField
                        placeholder="Tìm kiếm"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    {itemData.map((item) => (
                        <div className="order-card">
                            <div className="order-header">
                                <div className="shop-info">
                                    <span className="shop-name">
                                        <i className="shop-icon"><StorefrontIcon /></i> {item.tenCuaHang}
                                    </span>
                                    <button className="message-btn">
                                        <MessageCircle size={16} /> Nhắn tin
                                    </button>
                                </div>
                                <div className="order-status">
                                    <span style={{ paddingRight: 15, borderRight: '1px solid #005bbb' }}>Mã đơn hàng: <strong>{item.maDonHang}</strong></span>
                                    <span className="status canceled" style={{ paddingLeft: 15 }}>{ItemStatus[item.trangThai]}</span>
                                </div>
                            </div>

                            <div className="order-body">
                                <div className="product">
                                    <img
                                        srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        src={`${item.img}?w=248&fit=crop&auto=format`}
                                        loading="lazy"
                                        className="product-image"
                                    />
                                    <div className="product-info">
                                        <p className="product-name">{item.tenSanPham}</p>
                                        <p className="product-type">Phân loại: {item.phanLoai}</p>
                                        <p className="product-qty">Số lượng: {item.soLuong}</p>
                                    </div>
                                    <div className="product-price">
                                        <span className="new-price">{(item.tienCu - item.tienGiamGia).toLocaleString('vi-VN')}đ</span>
                                        {item.tienGiamGia > 0 &&
                                            <span className="old-price">{item.tienCu.toLocaleString('vi-VN')}đ</span>
                                        }
                                    </div>
                                </div>

                                <div className="total-price">
                                    <span className="title">Tổng tiền: </span>
                                    <strong className="price">{item.tongTien.toLocaleString('vi-VN')}đ</strong>
                                </div>
                            </div>

                            <div className="order-footer">
                                <p className="cancel-note">
                                    {item.trangThai === 3 &&
                                        <span>Đơn hàng đã được huỷ bởi Khách hàng. Lý do hủy: {item.lyDoHuy}</span>
                                    }
                                </p>
                                <div className="action-buttons">
                                    {[2, 3, 4].includes(item.trangThai) ?
                                        (
                                            <button className="btn-outline">Mua lại</button>
                                        ) : (
                                            <button className="btn-outline">Hủy đơn hàng </button>
                                        )}

                                    <button className="btn-outline">Xem chi tiết</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>) :
                (
                    <div className="order-empty">
                        <img src={emptyOrder} alt="emptyAddress" className="img-empty" />
                        <h2>Bạn chưa có đơn hàng nào.</h2>
                        <p>Thông tin và trạng thái đơn hàng sẽ hiển thị tại đây.</p>
                    </div>
                )}
        </div>
    );
};

export default OrderDisplay;