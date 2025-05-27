import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "../utils/axios";
import "./styles/AccountHistoryTransactionPage.scss";
import AccountTabsTransation from "../components/AccountTabsTransation";

const AccountHistoryTransactionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = useAuth();
    const params = new URLSearchParams(location.search);
    const tab = params.get("type") || "package";
    const [activeTab, setActiveTab] = useState(tab);
    const [transaction, setTransaction] = useState([[], []]);
    const [transactionContent, setTransactionContent] = useState([[], []]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setActiveTab(tab);
    }, [tab]);

    useEffect(() => {
        const fetchTransactionHistory = async () => {
            if (!userId) {
                console.log("No userId available");
                setError("User ID not available");
                setLoading(false);
                return;
            }

            try {
                // Fetch package history
                console.log("Fetching package history for userId:", userId);
                const packageResponse = await axios.get(`/history-packages/user/${userId}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Fetch point history
                console.log("Fetching point history for userId:", userId);
                const pointResponse = await axios.get(`/history-points/user/${userId}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log("Package API Response:", packageResponse.data);
                console.log("Point API Response:", pointResponse.data);

                if (packageResponse.data?.success && Array.isArray(packageResponse.data.data)) {
                    const formattedPackageData = packageResponse.data.data.map(item => {
                        return {
                            time: new Date(item.createdAt).toLocaleTimeString('vi-VN'),
                            date: new Date(item.createdAt).toLocaleDateString('vi-VN'),
                            name: item.packageId?.name || 'Gói dịch vụ',
                            additionalInfo: item.packageId?.description || '',
                            price: `${item.transactionId?.amount?.toLocaleString('vi-VN')} VND`,
                            details: {
                                packageName: item.packageId?.name || 'N/A',
                                transactionCode: item.transactionId?.momo_OrderId || 'N/A',
                                paymentMethod: item.transactionId?.paymentMethod?.toUpperCase() || 'N/A',
                                validUntil: `Thời hạn sử dụng gói ${item.packageId?.name || 'N/A'} đến: ${new Date(new Date(item.createdAt).getTime() + (item.packageId?.expire || 0) * 24 * 60 * 60 * 1000).toLocaleString('vi-VN')}`
                            }
                        };
                    });

                    // Format point history data
                    const formattedPointData = pointResponse.data?.success && Array.isArray(pointResponse.data.data) 
                        ? pointResponse.data.data.map(item => ({
                            ...item,
                            time: new Date(item.time).toLocaleTimeString('vi-VN'),
                            date: new Date(item.time).toLocaleDateString('vi-VN'),
                            name: item.packageInfo?.name || item.type,
                            additionalInfo: item.type === 'Nạp' 
                                ? `Gói ${item.packageInfo?.name || 'N/A'}`
                                : `Hoa Phượng: ${item.number_point_HoaPhuong}, Lá: ${item.number_point_La}`,
                            price: item.type === 'Nạp'
                                ? `${item.packageInfo?.price?.toLocaleString('vi-VN')} VND`
                                : `${item.number_point_HoaPhuong} Hoa Phượng`,
                            details: {
                                packageName: item.type === 'Nạp'
                                    ? item.packageInfo?.name || 'N/A'
                                    : item.type,
                                transactionCode: item.transactionId || 'N/A',
                                paymentMethod: item.status,
                                validUntil: item.type === 'Nạp'
                                    ? `Số điểm nhận được: ${item.number_point_HoaPhuong} Hoa Phượng, ${item.number_point_La} Lá`
                                    : `Thời gian: ${new Date(item.time).toLocaleString('vi-VN')}`
                            }
                        }))
                        : [];

                    console.log("Formatted package data:", formattedPackageData);
                    console.log("Formatted point data:", formattedPointData);

                    // Split package transactions into member and hoa-phuong arrays
                    const memberTransactions = formattedPackageData.filter(item => 
                        item.name.toLowerCase().includes('hội viên') || 
                        item.name.toLowerCase().includes('member') ||
                        item.name.toLowerCase().includes('utebook')
                    );

                    const hoaPhuongTransactions = formattedPointData
                        .filter(item => item.type === 'Nạp')
                        .map(item => ({
                            ...item,
                            type: 'Nạp',
                            time: item.time,
                            date: item.date,
                            name: item.packageInfo?.name || 'Nạp điểm',
                            additionalInfo: '',
                            price: item.packageInfo?.price
                                ? `${item.packageInfo.price.toLocaleString('vi-VN')} VND`
                                : '---',
                            details: {
                                packageName: item.packageInfo?.name || 'Nạp điểm',
                                transactionCode: item.transactionId || item._id || 'N/A',
                                paymentMethod: item.status,
                                validUntil: `Số điểm nhận được: ${item.number_point_HoaPhuong} Hoa Phượng, ${item.number_point_La} Lá`
                            }
                        }));

                    const contentTransactions = pointResponse.data?.success && Array.isArray(pointResponse.data.data)
                        ? pointResponse.data.data.filter(item => item.type === 'Đọc').map(item => ({
                            ...item,
                            type: 'Đọc',
                            time: new Date(item.time).toLocaleTimeString('vi-VN'),
                            date: new Date(item.time).toLocaleDateString('vi-VN'),
                            name: item.bookInfo?.bookname || 'Nội dung đã mua',
                            additionalInfo: item.chapterInfo?.chapterName || '',
                            price: `${item.number_point_HoaPhuong} Hoa Phượng`,
                            details: {
                                packageName: item.bookInfo?.bookname || 'Nội dung đã mua',
                                transactionCode: item._id || 'N/A',
                                paymentMethod: item.status,
                                validUntil: `Thời gian: ${new Date(item.time).toLocaleString('vi-VN')}`
                            }
                        }))
                        : [];

                    setTransaction([memberTransactions, hoaPhuongTransactions]);
                    setTransactionContent([contentTransactions, []]);

                    setError(null);
                } else {
                    console.error("Invalid response format:", packageResponse.data);
                    setError("Invalid response format from server");
                }
            } catch (error) {
                console.error("Error fetching transaction history:", error);
                setError(error.response?.data?.message || "Failed to fetch transaction history");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionHistory();
    }, [userId]);

    const handleTabClick = (type, page) => {
        navigate(`/utebook/account/transaction-histories?type=${type}&page=${page}`);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    console.log("Current transaction state:", transaction);

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
                        tabs={tabsC}
                    />
                }
            </div>
        </div>
    );
};

export default AccountHistoryTransactionPage;

const tabsP = [
    { id: "member", label: "Hội viên" },
    { id: "hoa-phuong", label: "Hoa phượng" },
];

const tabsC = [
    { id: "hoa-phuong", label: "Hoa phượng" },
];
