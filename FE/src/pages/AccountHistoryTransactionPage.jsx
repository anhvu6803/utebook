import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/AccountHistoryTransactionPage.scss";

import AccountTabsTransation from "../components/AccountTabsTransation";
const AccountHistoryTransactionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const tab = params.get("type") || "package";
    const [activeTab, setActiveTab] = useState(tab);

    useEffect(() => {
        setActiveTab(tab); // Cập nhật activeTab khi URL thay đổi
    }, [tab]);

    const handleTabClick = (type, page) => {
        navigate(`/utebook/account/transaction-histories?type=${type}&page=${page}`); // Cập nhật URL khi nhấn tab
    };
    return (
        <div className="transaction-settings">
            <div className="transaction-header">
                <h1 className="title">Lịch sử giao dịch</h1>
                <div className="tabs">
                    <button
                        onClick={() => handleTabClick('package', 1)}
                        className={`tab ${activeTab === 'package' ? 'active' : ''}`}
                    >
                        Mua gói cước
                    </button>
                    <button
                        onClick={() => handleTabClick('content', 1)}
                        className={`tab ${activeTab === 'content' ? 'active' : ''}`}
                    >
                        Mua nội dung
                    </button>
                </div>
            </div>
            <div className="transaction-content">
                {activeTab === 'package' &&
                    <AccountTabsTransation
                        transactions={transaction}
                        tabs={tabsP}
                    />
                }
                {activeTab === 'content' &&
                    <AccountTabsTransation
                        transactions={transactionContent}
                        tabs={tabsC} />}
            </div>
        </div>
    );
};

export default AccountHistoryTransactionPage;

const transaction = [
    [
        {
            time: '04:23:59',
            date: '15-03-2025',
            name: 'Hội viên Waka 3 Tháng',
            additionalInfo: '+ 90 ngày hội viên',
            price: '99.000 VND',
            details: {
                packageName: 'Tên gói cước: Hội viên Waka 3 Tháng',
                transactionCode: 'Mã giao dịch: 20250315042326_9309232_1_2_EW',
                paymentMethod: 'Hình thức thanh toán: MoMo',
                validUntil: 'Thời hạn sử dụng gói Hội viên Waka đến: 08-12-2025 23:59'
            }
        },
        {
            time: '04:23:59',
            date: '15-03-2025',
            name: 'Hội viên Waka 3 Tháng',
            additionalInfo: '+ 90 ngày hội viên',
            price: '99.000 VND',
            details: {
                packageName: 'Tên gói cước: Hội viên Waka 3 Tháng',
                transactionCode: 'Mã giao dịch: 20250315042326_9309232_1_2_EW',
                paymentMethod: 'Hình thức thanh toán: MoMo',
                validUntil: 'Thời hạn sử dụng gói Hội viên Waka đến: 08-12-2025 23:59'
            }
        },
    ],
    []
];
const transactionContent = [
    [],
    []
];

const tabsP = [
    { id: "member", label: "Hội viên" },
    { id: "hoa-phuong", label: "Hoa phượng" },
];

const tabsC = [
    { id: "sach-le", label: "Mua lẻ sách" },
    { id: "hoa-phuong", label: "Hoa phượng" },
];
