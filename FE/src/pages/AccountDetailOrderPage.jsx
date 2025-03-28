import React from "react";
import { useParams } from "react-router-dom";
import "./styles/AccountDetailOrderPage.scss";

import DetailOrder from "../components/DetailOrder";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const AccountDetailOrderPage = () => {

    const { orderId } = useParams();
    const item = itemData.find((item) => item.maDonHang === orderId);
    const voucher = 0;
    const shipDiscount = 0;
    const shipFee = 25799;
    return (
        <div className="detail-order-settings">
            <div className="order-left-containter">
                <div className="order-header">
                    <ArrowBackIosIcon className="icon" onClick={() => window.history.back()} />
                    <h1 className="title">Chi tiết đơn hàng</h1>
                </div>
                <div className="order-content">
                    <DetailOrder item={item} />
                </div>
            </div>
            <div className="order-right-containter">
                <div className="payment-content">
                    <div className="infor-payment">
                        <span className="title">Thông tin thanh toán</span>
                        <div className="content-line">
                            <p className="name">Sản phẩm: </p>
                            <p className="value"> {item.soLuong}</p>
                        </div>
                        <div className="content-line">
                            <p className="name">Tổng tiền </p>
                            <p className="value"> {item.tongTien.toLocaleString('vi-VN')}đ</p>
                        </div>
                        <div className="content-line">
                            <p className="name">Voucher của UTEBOOK </p>
                            <p className="value"> -{voucher.toLocaleString('vi-VN')}đ</p>
                        </div>
                        <div className="content-line">
                            <p className="name">Giảm giá vận chuyển </p>
                            <p className="value"> -{shipDiscount.toLocaleString('vi-VN')}đ</p>
                        </div>
                        <div className="content-line">
                            <p className="name">Phí vận chuyển </p>
                            <p className="value"> {shipFee.toLocaleString('vi-VN')}đ</p>
                        </div>
                    </div>
                    <div className="type-payment">
                        <div className="content-line">
                            <p className="name">Phương thức thanh toán </p>
                            <p className="value"> {item.phuongThucThanhToan}</p>
                        </div>
                    </div>
                    <div className="total-price">
                        <p className="name">TỔNG </p>
                        <p className="value"> {(item.tongTien + shipFee).toLocaleString('vi-VN')}đ</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountDetailOrderPage;

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