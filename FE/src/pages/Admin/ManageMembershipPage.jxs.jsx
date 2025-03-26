import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./styles/ManageMembershipPage.scss";

const ordersData = [
  { id: "ORD001", customer: "Nguyễn Văn A", total: "$120", type: "Đơn hàng", date: "2024-03-20" },
  { id: "ORD002", customer: "Trần Thị B", total: "$200", type: "Hội viên", date: "2024-03-18" },
  { id: "ORD003", customer: "Lê Văn C", total: "$150", type: "Đơn hàng", date: "2024-02-15" },
  { id: "ORD004", customer: "Phạm Thị D", total: "$180", type: "Hội viên", date: "2023-12-25" },
  { id: "ORD005", customer: "Đinh Văn E", total: "$250", type: "Đơn hàng", date: "2023-12-17" },
  { id: "ORD006", customer: "Bùi Thị F", total: "$300", type: "Hội viên", date: "2023-11-10" },
  { id: "ORD007", customer: "Hồ Văn G", total: "$220", type: "Đơn hàng", date: "2023-10-22" },
  { id: "ORD008", customer: "Vũ Thị H", total: "$190", type: "Hội viên", date: "2023-09-15" },
  { id: "ORD009", customer: "Lê Thị I", total: "$210", type: "Đơn hàng", date: "2023-08-05" },
  { id: "ORD010", customer: "Ngô Văn K", total: "$170", type: "Hội viên", date: "2023-07-30" },
  { id: "ORD011", customer: "Mai Văn L", total: "$320", type: "Đơn hàng", date: "2023-06-25" },
  { id: "ORD012", customer: "Phan Thị M", total: "$140", type: "Hội viên", date: "2023-05-20" },
  { id: "ORD013", customer: "Nguyễn Văn N", total: "$180", type: "Đơn hàng", date: "2023-04-18" },
  { id: "ORD014", customer: "Trần Văn O", total: "$280", type: "Hội viên", date: "2023-03-11" },
  { id: "ORD015", customer: "Lê Thị P", total: "$110", type: "Đơn hàng", date: "2023-02-25" },
  { id: "ORD016", customer: "Đặng Văn Q", total: "$200", type: "Hội viên", date: "2023-01-15" },
  { id: "ORD017", customer: "Hoàng Thị R", total: "$175", type: "Đơn hàng", date: "2022-12-10" },
  { id: "ORD018", customer: "Nguyễn Văn S", total: "$310", type: "Hội viên", date: "2022-11-22" },
  { id: "ORD019", customer: "Trần Thị T", total: "$280", type: "Đơn hàng", date: "2022-10-09" },
  { id: "ORD020", customer: "Lê Văn U", total: "$150", type: "Hội viên", date: "2022-09-15" },
  { id: "ORD021", customer: "Vũ Văn V", total: "$190", type: "Đơn hàng", date: "2022-08-03" },
  { id: "ORD022", customer: "Phan Văn W", total: "$210", type: "Hội viên", date: "2022-07-28" },
  { id: "ORD023", customer: "Đinh Văn X", total: "$350", type: "Đơn hàng", date: "2022-06-19" },
  { id: "ORD024", customer: "Mai Thị Y", total: "$230", type: "Hội viên", date: "2022-05-14" },
  { id: "ORD025", customer: "Hoàng Văn Z", total: "$180", type: "Đơn hàng", date: "2022-04-07" },
  { id: "ORD026", customer: "Nguyễn Văn B", total: "$300", type: "Hội viên", date: "2022-03-25" },
  { id: "ORD027", customer: "Trần Thị C", total: "$120", type: "Đơn hàng", date: "2022-02-15" },
  { id: "ORD028", customer: "Lê Văn D", total: "$270", type: "Hội viên", date: "2022-01-30" },
  { id: "ORD029", customer: "Đinh Thị E", total: "$240", type: "Đơn hàng", date: "2021-12-20" },
  { id: "ORD030", customer: "Vũ Văn F", total: "$150", type: "Hội viên", date: "2021-11-15" },
];
const itemsPerPage = 10;

const HistoryOrderPage = () => {
  const [orders] = useState(ordersData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterType, setFilterType] = useState("");

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

  return (
    <div className="history-order">
      <h1>Lịch sử đơn hàng</h1>

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
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.total}</td>
              <td>{order.type}</td>
              <td>{order.date}</td>
              <td className="success">Thành công</td>
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
    </div>
  );
};

export default HistoryOrderPage;
