import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import MembershipDetailModal from "../../components/Admin/MembershipDetailModal";
import "./styles/ManageMembershipPage.scss";

// Thêm nhiều thông tin hơn cho mock data
const ordersData = [
  { 
    id: "ORD001", 
    customer: "Nguyễn Văn A", 
    total: "$120", 
    type: "Đơn hàng", 
    date: "2024-03-20",
    status: "Thành công",
    fullName: "Nguyễn Văn A",
    userId: "U001",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    membershipType: "Hội viên Bạc",
    duration: "1 năm",
    transactionDate: "20/03/2024",
    time: "15:30",
    expiryDate: "20/03/2025",
    membershipStatus: "Hoạt động",
    payment: {
      method: "Thẻ tín dụng",
      amount: "$120",
      transactionId: "TX001",
      status: "Thành công"
    },
    benefits: [
      "Giảm 10% mọi đơn hàng",
      "Miễn phí vận chuyển",
      "Ưu tiên hỗ trợ khách hàng"
    ]
  },
  // ... (thêm thông tin tương tự cho các mục khác)
];

const itemsPerPage = 10;

const ManageMembershipPage = () => {
  const [orders, setOrders] = useState(ordersData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Lọc đơn hàng
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    return (
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filterDate || order.date === filterDate) &&
      (!filterMonth || orderDate.getMonth() + 1 === parseInt(filterMonth)) &&
      (!filterYear || orderDate.getFullYear() === parseInt(filterYear)) &&
      (!filterType || order.type === filterType)
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Xử lý khi nhấp vào dòng trong bảng
  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (orderId, newStatus) => {
    // Cập nhật trạng thái trong orders state
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          payment: {
            ...order.payment,
            status: newStatus
          }
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    // Đóng modal
    setShowModal(false);
  };

  return (
    <div className="membership-management">
      <h1>Quản lý Đơn Đăng Ký Hội Viên</h1>

      {/* Ô tìm kiếm */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm mã đơn hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Bộ lọc */}
      <div className="filter-container">
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">Lọc theo tháng</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
          ))}
        </select>
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="">Lọc theo năm</option>
          <option value="2024">Năm 2024</option>
          <option value="2023">Năm 2023</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Lọc theo loại</option>
          <option value="Đơn hàng">Đơn hàng</option>
          <option value="Hội viên">Hội viên</option>
        </select>
      </div>

      {/* Bảng danh sách đơn hàng */}
      <table>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Người đặt</th>
            <th>Giá tiền</th>
            <th>Loại</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {displayedOrders.map((order) => (
            <tr key={order.id} onClick={() => handleRowClick(order)} className="clickable-row">
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.total}</td>
              <td>{order.type}</td>
              <td>{order.date}</td>
              <td className={`order-status ${order.status === "Thành công" ? "success" : 
                              order.status === "Đang xử lý" ? "pending" : 
                              order.status === "Hoàn tiền" ? "refunded" : "failed"}`}>
                <div className="status-indicator"></div>
                {order.status || order.payment?.status || "Thành công"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn prev" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Trước
          </button>
          <span>Trang {currentPage} / {totalPages}</span>
          <button className="pagination-btn next" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Tiếp
          </button>
        </div>
      )}

      {/* Modal chi tiết */}
      {showModal && selectedOrder && (
        <MembershipDetailModal 
          membership={selectedOrder} 
          onClose={() => setShowModal(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ManageMembershipPage;
