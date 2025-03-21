import { useState } from "react";
import { FaSearch, FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./styles/ManageOrderPage.scss";
import AdminPasswordModal from "../../components/Admin/AdminPasswordModal";
const ordersData = [
  { id: "ORD001", customer: "Nguyễn Văn A", total: "$120", status: "Đang xử lý", date: "2024-03-20", payment: "Chuyển khoản" },
  { id: "ORD002", customer: "Trần Thị B", total: "$200", status: "Đã giao", date: "2024-03-18", payment: "Tiền mặt" },
  { id: "ORD003", customer: "Lê Văn C", total: "$150", status: "Đã hủy", date: "2024-02-15", payment: "Momo" },
  { id: "ORD004", customer: "Phạm Thị D", total: "$180", status: "Đang xử lý", date: "2023-12-25", payment: "ZaloPay" },
  { id: "ORD005", customer: "Đinh Văn E", total: "$250", status: "Đã giao", date: "2023-12-17", payment: "Chuyển khoản" },
  { id: "ORD006", customer: "Bùi Thị F", total: "$300", status: "Đã hủy", date: "2023-11-10", payment: "Tiền mặt" },
  { id: "ORD007", customer: "Hồ Văn G", total: "$220", status: "Đang xử lý", date: "2023-10-22", payment: "Momo" },
  { id: "ORD008", customer: "Vũ Thị H", total: "$190", status: "Đã giao", date: "2023-09-15", payment: "ZaloPay" },
  { id: "ORD009", customer: "Lê Thị I", total: "$210", status: "Đang xử lý", date: "2023-08-05", payment: "Chuyển khoản" },
  { id: "ORD010", customer: "Ngô Văn K", total: "$170", status: "Đã giao", date: "2023-07-30", payment: "Tiền mặt" },
  { id: "ORD011", customer: "Mai Văn L", total: "$320", status: "Đang xử lý", date: "2023-06-25", payment: "Momo" },
  { id: "ORD012", customer: "Phan Thị M", total: "$140", status: "Đã hủy", date: "2023-05-20", payment: "ZaloPay" },
  { id: "ORD013", customer: "Nguyễn Văn N", total: "$180", status: "Đã giao", date: "2023-04-18", payment: "Tiền mặt" },
  { id: "ORD014", customer: "Trần Văn O", total: "$280", status: "Đang xử lý", date: "2023-03-11", payment: "Chuyển khoản" },
  { id: "ORD015", customer: "Lê Thị P", total: "$110", status: "Đã hủy", date: "2023-02-25", payment: "Momo" },
  { id: "ORD016", customer: "Đặng Văn Q", total: "$200", status: "Đang xử lý", date: "2023-01-15", payment: "ZaloPay" },
  { id: "ORD017", customer: "Hoàng Thị R", total: "$175", status: "Đã giao", date: "2022-12-10", payment: "Chuyển khoản" },
  { id: "ORD018", customer: "Nguyễn Văn S", total: "$310", status: "Đã hủy", date: "2022-11-22", payment: "Tiền mặt" },
  { id: "ORD019", customer: "Trần Thị T", total: "$280", status: "Đang xử lý", date: "2022-10-09", payment: "Momo" },
  { id: "ORD020", customer: "Lê Văn U", total: "$150", status: "Đã giao", date: "2022-09-15", payment: "ZaloPay" },
  { id: "ORD021", customer: "Vũ Văn V", total: "$190", status: "Đang xử lý", date: "2022-08-03", payment: "Chuyển khoản" },
  { id: "ORD022", customer: "Phan Văn W", total: "$210", status: "Đã giao", date: "2022-07-28", payment: "Tiền mặt" },
  { id: "ORD023", customer: "Đinh Văn X", total: "$350", status: "Đã hủy", date: "2022-06-19", payment: "Momo" },
  { id: "ORD024", customer: "Mai Thị Y", total: "$230", status: "Đang xử lý", date: "2022-05-14", payment: "ZaloPay" },
  { id: "ORD025", customer: "Hoàng Văn Z", total: "$180", status: "Đã giao", date: "2022-04-07", payment: "Chuyển khoản" },
  { id: "ORD026", customer: "Nguyễn Văn B", total: "$300", status: "Đang xử lý", date: "2022-03-25", payment: "Tiền mặt" },
  { id: "ORD027", customer: "Trần Thị C", total: "$120", status: "Đã hủy", date: "2022-02-15", payment: "Momo" },
  { id: "ORD028", customer: "Lê Văn D", total: "$270", status: "Đã giao", date: "2022-01-30", payment: "ZaloPay" },
  { id: "ORD029", customer: "Đinh Thị E", total: "$240", status: "Đang xử lý", date: "2021-12-20", payment: "Chuyển khoản" },
  { id: "ORD030", customer: "Vũ Văn F", total: "$150", status: "Đã giao", date: "2021-11-15", payment: "Tiền mặt" },
];


const itemsPerPage = 8;


const ManageOrderPage = () => {
  const [orders, setOrders] = useState(ordersData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mở modal nhập mật khẩu trước khi đổi trạng thái
  const handleChangeStatus = (order, status) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setIsModalOpen(true);
  };

  // Xác nhận đổi trạng thái sau khi nhập mật khẩu admin
  const handleConfirmStatusChange = () => {
    setOrders(orders.map(order => 
      order.id === selectedOrder.id ? { ...order, status: newStatus } : order
    ));
    setIsModalOpen(false);
  };

  // Lọc đơn hàng
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    return (
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filterDate || order.date === filterDate) &&
      (!filterMonth || orderDate.getMonth() + 1 === parseInt(filterMonth)) &&
      (!filterYear || orderDate.getFullYear() === parseInt(filterYear))
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="order-management">
      {/* Thanh tìm kiếm */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h1>📦 Quản lý Đơn hàng</h1>

      {/* Bộ lọc đơn hàng */}
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
      </div>

      {/* Bảng đơn hàng */}
      <table>
        <thead>
          <tr>
            <th>Người đặt</th>
            <th>Mã đơn hàng</th>
            <th>Giá trị</th>
            <th>Trạng thái</th>
            <th>Ngày đặt</th>
            <th>Thanh toán</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {displayedOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.customer}</td>
              <td>{order.id}</td>
              <td>{order.total}</td>
              <td>
                <span className={`status ${order.status.replace(" ", "-").toLowerCase()}`}>{order.status}</span>
              </td>
              <td>{order.date}</td>
              <td>{order.payment}</td>
              <td className="actions">
                <button className="action-btn processing" onClick={() => handleChangeStatus(order, "Đang xử lý")}>
                  <FaTruck />
                </button>
                <button className="action-btn delivered" onClick={() => handleChangeStatus(order, "Đã giao")}>
                  <FaCheckCircle />
                </button>
                <button className="action-btn canceled" onClick={() => handleChangeStatus(order, "Đã hủy")}>
                  <FaTimesCircle />
                </button>
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

      {isModalOpen && (
        <AdminPasswordModal 
          user={selectedOrder} 
          action="changeStatus"
          onConfirm={handleConfirmStatusChange}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageOrderPage;


