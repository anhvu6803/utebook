import React from "react";
import "./styles/DetailOrder.scss";

import ProgressBar from "./ProgressBar";
import ProgressBarMini from "./ProgressBarMini";
import { MessageCircle } from "lucide-react";
import StorefrontIcon from '@mui/icons-material/Storefront';

const ItemStatus = {
    "need_confirm": "Chờ xác nhận",
    "delivering": "Đang giao hàng",
    "delivered": "Đã giao",
    "received": "Đã nhận",
    "canceled": "Đã hủy",
    "failed": "Giao hàng không thành công"
};

const DetailOrder = ({ item }) => {

    return (
        <div className="detail-order-card-container">
            {['need_confirm', 'delivering', 'delivered', 'received'].includes(item.trangThai) ?
                (
                    <div className="order-progress">
                        <ProgressBar statusOrder={item.trangThai} />
                    </div>
                )
                :
                (
                    <div className="cancel-tittle">
                        <h1>Người mua đã huỷ đơn hàng </h1>
                        <p>Đã hủy đơn hàng</p>
                    </div>
                )
            }
            <div className="detail-order-card">
                <div className="detail-order-header">
                    <div className="shop-info">
                        <span className="shop-name">
                            <i className="shop-icon"><StorefrontIcon /></i> {item.tenCuaHang}
                        </span>
                        <button className="message-btn">
                            <MessageCircle size={16} /> Nhắn tin
                        </button>
                    </div>
                    <div className="detail-order-status">
                        <span style={{ paddingRight: 15, borderRight: '1px solid #005bbb' }}>Mã đơn hàng: <strong>{item.maDonHang}</strong></span>
                        <span className="status canceled" style={{ paddingLeft: 15 }}>{ItemStatus[item.trangThai]}</span>
                    </div>
                </div>

                <div className="detail-order-body">
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

                <div className="detail-order-footer">
                    <p className="cancel-note">
                        {item.trangThai === 3 &&
                            <span>Đơn hàng đã được huỷ bởi Khách hàng. Lý do hủy: {item.lyDoHuy}</span>
                        }
                    </p>
                    <div className="action-buttons">
                        {['received', 'canceled', 'failed'].includes(item.trangThai) ?
                            (
                                <button className="btn-outline">Mua lại</button>
                            ) : (
                                <div>
                                    {item.trangThai === "delivered" ?
                                        (
                                            <button className="btn-outline">Đã nhận hàng </button>
                                        ) : (
                                            <button className="btn-outline">Hủy đơn hàng </button>
                                        )}

                                </div>

                            )}
                    </div>
                </div>
            </div >
            {
                ['need_confirm', 'delivering', 'delivered', 'received'].includes(item.trangThai) ?
                    (
                        <div>
                            {
                                item.phuongThucThanhToan === "Thanh toán khi nhận hàng" &&
                                <div className="infor-delivery">
                                    <span className="title">Thông tin vận chuyển </span>
                                    <div className="infor-delivery-container">
                                        <p>Đơn vị vận chuyển: UTE Express</p>
                                        <p>Địa chỉ nhận hàng</p>
                                        <div className="infor-delivery-content">
                                            <div className="address-detail">
                                                <span className="name">AnhVu</span>
                                                <span className="phone">0342380803</span>
                                                <span className="address">
                                                    Ho Chi Minh, Phường Hiệp Phú, Thành phố
                                                    Thủ Đức, Hồ Chí Minh
                                                </span>
                                            </div>
                                            <div className="process-delivery">
                                                <ProgressBarMini statusOrder={item.trangThai} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    )
                    :
                    (
                        <div className="reason-card-container">
                            <span className="title">Thông tin hủy đơn </span>
                            <div className="reason-card-content">
                                <div className="infor-cancel">
                                    <p>Người hủy: Người mua</p>
                                    <p>Lý do hủy: {item.lyDoHuy}</p>
                                    <p>Thời gian huỷ: 21:01 12/03/2025</p>
                                </div>
                            </div>
                        </div>
                    )
            }
        </div >
    );
};

export default DetailOrder;
