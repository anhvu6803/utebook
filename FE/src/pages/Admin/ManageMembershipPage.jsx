import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./styles/ManageMembershipPage.scss";
import MembershipDetailModal from "../../components/Admin/MembershipDetailModal";
import AdminPasswordModal from "../../components/Admin/AdminPasswordModal";

// Sample data - replace with actual data from your backend
const transactionData = [
  { id: "TX001", username: "Nguyễn Văn A", type: "Gói 1 ngày", duration: "1 ngày", price: "20000", status: "Thành công", date: "2024-03-20", paymentMethod: "MoMo E-Wallet" },
  { id: "TX002", username: "Trần Thị B", type: "Gói 1 tháng", duration: "1 tháng", price: "150000", status: "Thành công", date: "2024-03-18", paymentMethod: "Ngân hàng VietComBank" },
  { id: "TX003", username: "Lê Văn C", type: "Gói 1 năm", duration: "1 năm", price: "1500000", status: "Thành công", date: "2024-03-15", paymentMethod: "Thẻ Visa/Mastercard" },
  { id: "TX004", username: "Phạm Thị D", type: "Gói 1 ngày", duration: "1 ngày", price: "20000", status: "Thành công", date: "2024-02-12", paymentMethod: "ZaloPay" },
  { id: "TX005", username: "Nguyễn Văn E", type: "Gói 1 tháng", duration: "1 tháng", price: "150000", status: "Thành công", date: "2024-02-08", paymentMethod: "VNPay" },
  { id: "TX006", username: "Trần Thị F", type: "Gói 1 năm", duration: "1 năm", price: "1500000", status: "Đang xử lý", date: "2024-02-05", paymentMethod: "Ngân hàng BIDV" },
  { id: "TX007", username: "Lê Văn G", type: "Gói 1 ngày", duration: "1 ngày", price: "20000", status: "Thất bại", date: "2024-01-20", paymentMethod: "MoMo E-Wallet" },
  { id: "TX008", username: "Phạm Thị H", type: "Gói 1 tháng", duration: "1 tháng", price: "150000", status: "Thành công", date: "2024-01-18", paymentMethod: "Ngân hàng VietComBank" },
  { id: "TX009", username: "Nguyễn Văn I", type: "Gói 1 năm", duration: "1 năm", price: "1500000", status: "Thành công", date: "2024-01-15", paymentMethod: "Thẻ Visa/Mastercard" },
  { id: "TX010", username: "Trần Thị K", type: "Gói 1 ngày", duration: "1 ngày", price: "20000", status: "Hoàn tiền", date: "2023-12-20", paymentMethod: "ZaloPay" },
  { id: "TX011", username: "Lê Văn M", type: "Gói 1 tháng", duration: "1 tháng", price: "150000", status: "Thành công", date: "2023-12-15", paymentMethod: "VNPay" },
  { id: "TX012", username: "Phạm Thị N", type: "Gói 1 năm", duration: "1 năm", price: "1500000", status: "Thành công", date: "2023-12-10", paymentMethod: "Ngân hàng BIDV" },
  { id: "TX013", username: "Nguyễn Văn P", type: "Gói 1 ngày", duration: "1 ngày", price: "20000", status: "Thất bại", date: "2023-11-05", paymentMethod: "MoMo E-Wallet" },
  { id: "TX014", username: "Trần Thị Q", type: "Gói 1 tháng", duration: "1 tháng", price: "150000", status: "Hoàn tiền", date: "2023-10-31", paymentMethod: "Ngân hàng VietComBank" },
  { id: "TX015", username: "Lê Văn R", type: "Gói 1 năm", duration: "1 năm", price: "1500000", status: "Thành công", date: "2023-10-25", paymentMethod: "Thẻ Visa/Mastercard" },
  // ... more data ...
];

const itemsPerPage = 8;

const ManageMembershipPage = () => {
  const [transactions, setTransactions] = useState(transactionData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc' // Sắp xếp mặc định theo thời gian giảm dần (mới nhất)
  });
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(null);

  // Hàm xử lý khi thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  // Hàm xử lý khi thay đổi bộ lọc loại hội viên
  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  // Hàm xử lý khi thay đổi bộ lọc trạng thái
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  // Hàm xử lý khi thay đổi cách sắp xếp
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset về trang 1 khi thay đổi sắp xếp
  };

  // Hàm xử lý khi click vào một dòng trong bảng
  const handleRowClick = (transaction) => {
    setPendingTransaction(transaction);
    setShowPasswordModal(true);
  };

  // Thêm hàm xử lý khi xác thực thành công
  const handlePasswordConfirm = () => {
    setShowPasswordModal(false);
    
    // Tạo dữ liệu chi tiết giao dịch
    const detailedTransaction = {
      ...pendingTransaction,
      time: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      userId: "U" + Math.floor(10000 + Math.random() * 90000),
      fullName: pendingTransaction.username,
      email: `${pendingTransaction.username.toLowerCase().replace(' ', '.')}@gmail.com`,
      phone: `0${Math.floor(900000000 + Math.random() * 90000000)}`,
      transactionDate: pendingTransaction.date,
      membershipStatus: pendingTransaction.status === "Thành công" ? "Hoạt động" : "Chưa kích hoạt",
      expiryDate: getExpiryDate(pendingTransaction.date, pendingTransaction.duration),
      payment: {
        method: pendingTransaction.paymentMethod,
        transactionId: pendingTransaction.id,
        amount: pendingTransaction.price + " VNĐ",
        status: pendingTransaction.status
      },
      benefits: getMembershipBenefits(pendingTransaction.type),
    };
    
    setSelectedTransaction(detailedTransaction);
    setShowModal(true);
    setPendingTransaction(null);
  };

  // Thêm hàm đóng modal password
  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    setPendingTransaction(null);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  // Hàm phụ trợ để tính ngày hết hạn
  const getExpiryDate = (startDate, duration) => {
    const date = new Date(startDate);
    let months = 1;
    
    if (duration === "3 tháng") months = 3;
    else if (duration === "6 tháng") months = 6;
    
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  // Hàm phụ trợ để lấy lợi ích theo loại hội viên
  const getMembershipBenefits = (type) => {
    switch(type) {
      case "Gói 1 ngày":
        return [
          "Đọc không giới hạn sách trong 24 giờ",
          "Tải xuống 2 sách",
          "Hỗ trợ trực tuyến cơ bản"
        ];
      case "Gói 1 tháng":
        return [
          "Đọc không giới hạn sách trong 30 ngày",
          "Tải xuống 15 sách",
          "Hỗ trợ trực tuyến ưu tiên",
          "Truy cập sớm vào sách mới"
        ];
      case "Gói 1 năm":
        return [
          "Đọc không giới hạn sách trong 365 ngày",
          "Tải xuống không giới hạn",
          "Hỗ trợ trực tuyến 24/7",
          "Ưu đãi đặc biệt từ các đối tác",
          "Không có quảng cáo",
          "Giảm giá đặc biệt cho năm tiếp theo"
        ];
      default:
        return [];
    }
  };

  // Lọc và sắp xếp danh sách giao dịch
  const filteredTransactions = transactions
    .filter(transaction => {
      return (
        (transaction.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
         transaction.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!typeFilter || transaction.type === typeFilter) &&
        (!statusFilter || transaction.status === statusFilter)
      );
    })
    .sort((a, b) => {
      if (sortConfig.key === 'date') {
        // Sắp xếp theo ngày tháng
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (sortConfig.direction === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      } else if (sortConfig.key === 'price') {
        // Sắp xếp theo giá
        const priceA = parseInt(a.price);
        const priceB = parseInt(b.price);
        if (sortConfig.direction === 'asc') {
          return priceA - priceB;
        } else {
          return priceB - priceA;
        }
      }
      return 0;
    });

  const getTypeClass = (type) => {
    switch(type) {
      case 'Gói 1 ngày':
        return 'daily';
      case 'Gói 1 tháng':
        return 'monthly';
      case 'Gói 1 năm':
        return 'yearly';
      default:
        return '';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Thành công':
        return 'active';
      case 'Đang xử lý':
        return 'pending';
      case 'Thất bại':
        return 'expired';
      case 'Hoàn tiền':
        return 'refunded';
      default:
        return '';
    }
  };

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const displayedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="membership-management">
      <h1>💳 Quản Lý Giao Dịch Đăng Ký Hội Viên</h1>
      
      <div className="header-actions">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã giao dịch..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-container">
          <select 
            value={typeFilter} 
            onChange={handleTypeFilterChange}
          >
            <option value="">Tất cả gói hội viên</option>
            <option value="Gói 1 ngày">Gói 1 ngày</option>
            <option value="Gói 1 tháng">Gói 1 tháng</option>
            <option value="Gói 1 năm">Gói 1 năm</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={handleStatusFilterChange}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Thành công">Thành công</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Thất bại">Thất bại</option>
            <option value="Hoàn tiền">Hoàn tiền</option>
          </select>

          <button 
            className="sort-btn" 
            onClick={() => handleSort('date')}
          >
            Sắp xếp theo thời gian {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </button>

          <button 
            className="sort-btn" 
            onClick={() => handleSort('price')}
          >
            Sắp xếp theo giá {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Mã giao dịch</th>
            <th>Tên người dùng</th>
            <th>Loại hội viên</th>
            <th>Thời hạn</th>
            <th>Giá</th>
            <th>Phương thức thanh toán</th>
            <th>Trạng thái</th>
            <th>Ngày giao dịch</th>
          </tr>
        </thead>
        <tbody>
          {displayedTransactions.map((transaction) => (
            <tr 
              key={transaction.id} 
              onClick={() => handleRowClick(transaction)}
              className="clickable-row"
            >
              <td>{transaction.id}</td>
              <td>{transaction.username}</td>
              <td>
                <span className={`type-tag ${getTypeClass(transaction.type)}`}>
                  {transaction.type}
                </span>
              </td>
              <td>{transaction.duration}</td>
              <td>{parseInt(transaction.price).toLocaleString()} VNĐ</td>
              <td>{transaction.paymentMethod}</td>
              <td>
                <span className={`status-tag ${getStatusClass(transaction.status)}`}>
                  {transaction.status}
                </span>
              </td>
              <td>{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={() => setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span>Trang {currentPage} / {totalPages}</span>
          <button 
            className="pagination-btn" 
            onClick={() => setCurrentPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Tiếp
          </button>
        </div>
      )}

      {/* Thêm Modal Password */}
      {showPasswordModal && (
        <AdminPasswordModal
          onClose={handlePasswordModalClose}
          onConfirm={handlePasswordConfirm}
        />
      )}

      {/* Modal chi tiết giao dịch */}
      {showModal && selectedTransaction && (
        <MembershipDetailModal
          membership={selectedTransaction}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ManageMembershipPage; 