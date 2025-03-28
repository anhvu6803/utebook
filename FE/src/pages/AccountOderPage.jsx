import React, { useState, useEffect } from "react";
import {
    useLocation,
    useNavigate,
    useParams,
    Outlet
} from "react-router-dom";
import "./styles/AccountOderPage.scss";

import OrderDisplay from "../components/OrderDisplay";

const AccountHistoryTransactionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") || "all";
    const { orderId } = useParams();
    const [activeTab, setActiveTab] = useState(tab);

    //data
    const allOders = itemData;;
    const needConfirmOrders = itemData.filter((item) => item.trangThai === 'need_confirm');
    const deliveringOrders = itemData.filter((item) => item.trangThai === 'delivering');
    const deliveredOrders = itemData.filter((item) => item.trangThai === 'delivered');
    const cancelledOrders = itemData.filter((item) => item.trangThai === 'canceled');
    const failedOrders = itemData.filter((item) => item.trangThai === 'failed');

    useEffect(() => {
        setActiveTab(tab); // Cập nhật activeTab khi URL thay đổi
    }, [tab]);

    const handleTabClick = (tab) => {
        navigate(`/utebook/account/orders?tab=${tab}`); // Cập nhật URL khi nhấn tab
    };
    return (
        <div className="order-settings">
            {orderId ? (<Outlet />) :
                (
                    <div>
                        <div className="order-header">
                            <h1 className="title">Quản lý đơn hàng</h1>
                            <div className="tabs">
                                <button
                                    onClick={() => handleTabClick('all')}
                                    className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                                >
                                    Tất cả
                                    <span style={{
                                        background: '#e8f0fe',
                                        borderRadius: 18,
                                        padding: 2,
                                        marginLeft: 5
                                    }}>
                                        {allOders.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleTabClick('need_confirm')}
                                    className={`tab ${activeTab === 'need_confirm' ? 'active' : ''}`}
                                >
                                    Chờ xác nhận
                                    <span style={{
                                        background: '#e8f0fe',
                                        borderRadius: 18,
                                        padding: 2,
                                        marginLeft: 5
                                    }}>
                                        {needConfirmOrders.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleTabClick('delivering')}
                                    className={`tab ${activeTab === 'delivering' ? 'active' : ''}`}
                                >
                                    Đang giao hàng
                                    <span style={{
                                        background: '#e8f0fe',
                                        borderRadius: 18,
                                        padding: 2,
                                        marginLeft: 5
                                    }}>
                                        {deliveringOrders.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleTabClick('delivered')}
                                    className={`tab ${activeTab === 'delivered' ? 'active' : ''}`}
                                >
                                    Đã giao
                                    <span style={{
                                        background: '#e8f0fe',
                                        borderRadius: 18,
                                        padding: 2,
                                        marginLeft: 5
                                    }}>
                                        {deliveredOrders.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleTabClick('canceled')}
                                    className={`tab ${activeTab === 'canceled' ? 'active' : ''}`}
                                >
                                    Đã Hủy
                                    <span style={{
                                        background: '#e8f0fe',
                                        borderRadius: 18,
                                        padding: 2,
                                        marginLeft: 5
                                    }}>
                                        {cancelledOrders.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleTabClick('failed')}
                                    className={`tab ${activeTab === 'failed' ? 'active' : ''}`}
                                >
                                    Giao hàng không thành công
                                    <span style={{
                                        background: '#e8f0fe',
                                        borderRadius: 18,
                                        padding: 2,
                                        marginLeft: 5
                                    }}>
                                        {failedOrders.length}
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="order-content">
                            {activeTab === 'all' &&
                                <OrderDisplay itemData={allOders} />
                            }
                            {activeTab === 'need_confirm' &&
                                <OrderDisplay itemData={needConfirmOrders} />
                            }
                            {activeTab === 'delivering' &&
                                <OrderDisplay itemData={deliveringOrders} />
                            }
                            {activeTab === 'delivered' &&
                                <OrderDisplay itemData={deliveredOrders} />
                            }
                            {activeTab === 'canceled' &&
                                <OrderDisplay itemData={cancelledOrders} />
                            }
                            {activeTab === 'failed' &&
                                <OrderDisplay itemData={failedOrders} />
                            }
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default AccountHistoryTransactionPage;

const itemData = [
    {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        tenCuaHang: "Nhà Sách Tri Thức",
        maDonHang: "DH001",
        trangThai: 'canceled',
        tienGiamGia: 20000,
        tienCu: 120000,
        tenSanPham: "Đắc Nhân Tâm",
        phanLoai: "Bìa mềm",
        lyDoHuy: "Muốn thay đổi số lượng sản phẩm, phân loại sản phẩm",
        soLuong: 1,
        tongTien: 179000,
        voucher: 0,
        giamGiaVanChuyen: 0,
        phiVanChuyen: 25891,
        phuongThucThanhToan: "Thanh toán khi nhận hàng"
    },
    {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        tenCuaHang: "Nhà Sách Tri Thức",
        maDonHang: "DH002",
        trangThai: 'delivered',
        tienGiamGia: 0,
        tienCu: 85000,
        tenSanPham: "7 Thói Quen Hiệu Quả",
        phanLoai: "Bìa cứng",
        lyDoHuy: "",
        soLuong: 2,
        tongTien: 179000,
        voucher: 0,
        giamGiaVanChuyen: 0,
        phiVanChuyen: 25891,
        phuongThucThanhToan: "Thanh toán khi nhận hàng"
    },
    {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        tenCuaHang: "Nhà Sách Văn Hóa",
        maDonHang: "DH003",
        trangThai: 'canceled',
        tienGiamGia: 15000,
        tienCu: 98000,
        tenSanPham: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
        phanLoai: "Bìa mềm",
        lyDoHuy: "Muốn thay đổi số lượng sản phẩm, phân loại sản phẩm",
        soLuong: 1,
        tongTien: 179000,
        voucher: 0,
        giamGiaVanChuyen: 0,
        phiVanChuyen: 25891,
        phuongThucThanhToan: "Thanh toán khi nhận hàng"
    },
    {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        tenCuaHang: "BookHub",
        maDonHang: "DH004",
        trangThai: 'received',
        tienGiamGia: 30000,
        tienCu: 135000,
        tenSanPham: "Một Cuốn Sách Về Chủ Nghĩa Tối Giản",
        phanLoai: "Bìa cứng",
        lyDoHuy: "",
        soLuong: 1,
        tongTien: 179000,
        voucher: 0,
        giamGiaVanChuyen: 0,
        phiVanChuyen: 25891,
        phuongThucThanhToan: "Thanh toán khi nhận hàng"
    },
    {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        tenCuaHang: "BookCity",
        maDonHang: "DH005",
        trangThai: 'need_confirm',
        tienGiamGia: 25000,
        tienCu: 99000,
        tenSanPham: "Cafe Cùng Tony",
        phanLoai: "Bìa mềm",
        lyDoHuy: "",
        soLuong: 3,
        tongTien: 179000,
        voucher: 0,
        giamGiaVanChuyen: 0,
        phiVanChuyen: 25891,
        phuongThucThanhToan: "Thanh toán khi nhận hàng"
    }
];
