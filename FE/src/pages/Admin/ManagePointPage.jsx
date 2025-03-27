import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./styles/ManagePointPage.scss";
import ActivityDetailModal from "../../components/Admin/ActivityDeailModal";

// Sample data - replace with actual data from your backend
const pointHistoryData = [
  { id: "PH001", username: "Nguyễn Văn A", points: "+100", action: "Nạp", date: "2024-03-20" },
  { id: "PH002", username: "Trần Thị B", points: "-10", action: "Đọc", date: "2024-03-18" },
  { id: "PH003", username: "Lê Văn C", points: "+50", action: "Thu nhập", date: "2024-03-15" },
  { id: "PH004", username: "Phạm Thị D", points: "-20", action: "Đổi quà", date: "2024-03-12" },
  { id: "PH005", username: "Nguyễn Văn E", points: "+10", action: "Mua hàng", date: "2024-03-08" },
  { id: "PH006", username: "Trần Thị F", points: "-5", action: "Đổi quà", date: "2024-03-05" },
  { id: "PH007", username: "Lê Văn G", points: "+20", action: "Thu nhập", date: "2024-03-02" },
  { id: "PH008", username: "Phạm Thị H", points: "-10", action: "Đọc", date: "2024-02-28" },
  { id: "PH009", username: "Nguyễn Văn I", points: "+10", action: "Mua hàng", date: "2024-02-25" },
  { id: "PH010", username: "Trần Thị K", points: "-5", action: "Đổi quà", date: "2024-02-20" },
  { id: "PH011", username: "Lê Văn M", points: "+20", action: "Thu nhập", date: "2024-02-15" },
  { id: "PH012", username: "Phạm Thị N", points: "-10", action: "Đọc", date: "2024-02-10" },
  { id: "PH013", username: "Nguyễn Văn P", points: "+10", action: "Mua hàng", date: "2024-02-05" },
  { id: "PH014", username: "Trần Thị Q", points: "-5", action: "Đổi quà", date: "2024-01-31" },
  { id: "PH015", username: "Lê Văn R", points: "+20", action: "Thu nhập", date: "2024-01-25" },
  { id: "PH016", username: "Phạm Thị S", points: "-10", action: "Đọc", date: "2024-01-20" },
  { id: "PH017", username: "Nguyễn Văn T", points: "+10", action: "Mua hàng", date: "2024-01-15" },
  { id: "PH018", username: "Trần Thị U", points: "-5", action: "Đổi quà", date: "2024-01-10" },
  { id: "PH019", username: "Lê Văn V", points: "+20", action: "Thu nhập", date: "2024-01-05" },
  { id: "PH020", username: "Phạm Thị W", points: "-10", action: "Đọc", date: "2024-01-01" },
  
  // ... more data ...
];

const itemsPerPage = 8;

const ManagePointPage = () => {
  const [pointHistory, setPointHistory] = useState(pointHistoryData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc' // Sắp xếp mặc định theo thời gian giảm dần (mới nhất)
  });
  const [actionFilter, setActionFilter] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Hàm xử lý khi thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  // Hàm xử lý khi thay đổi bộ lọc hoạt động
  const handleActionFilterChange = (e) => {
    setActionFilter(e.target.value);
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

  // Thêm hàm xử lý thay đổi trạng thái
  const handleStatusChange = (activityId, newStatus) => {
    // Cập nhật trạng thái trong pointHistory state
    const updatedHistory = pointHistory.map(item => {
      if (item.id === activityId) {
        return {
          ...item,
          status: newStatus
        };
      }
      return item;
    });
    
    setPointHistory(updatedHistory);
    
    // Tìm và cập nhật hoạt động được chọn hiện tại để modal hiển thị đúng
    if (selectedActivity && selectedActivity.id === activityId) {
      setSelectedActivity({
        ...selectedActivity,
        status: newStatus
      });
    }

    // Đóng modal sau khi cập nhật
    setShowModal(false);
  };

  // Hàm xử lý khi click vào một dòng trong bảng
  const handleRowClick = (activity) => {
    // Mở rộng thông tin hoạt động với dữ liệu bổ sung
    const detailedActivity = {
      ...activity,
      status: activity.status || "Thành công", // Đảm bảo luôn có trạng thái
      time: "15:30:45", // Giả lập dữ liệu - thay bằng dữ liệu thật khi tích hợp
      description: `${activity.action} điểm thành viên`,
      userId: "U" + Math.floor(10000 + Math.random() * 90000),
      previousBalance: parseInt(activity.points) >= 0 
        ? (parseInt(activity.points.replace("+", "")) - 100).toString() 
        : (Math.abs(parseInt(activity.points)) + 100).toString(),
      currentBalance: parseInt(activity.points) >= 0 
        ? (parseInt(activity.points.replace("+", "")) + 100).toString() 
        : (100 - Math.abs(parseInt(activity.points))).toString(),
      
      // Thông tin cho nạp điểm
      ...(activity.action === "Nạp" && {
        paymentMethod: getRandomPaymentMethod(),
        transactionId: "TX" + Math.floor(10000000 + Math.random() * 90000000),
        amount: parseInt(activity.points.replace("+", "")) * 1000, // Giả sử 1 điểm = 1000đ
        adminApproved: "Admin001",
        approvalDate: `${activity.date} 15:35:20`,
        remarks: "Thanh toán thành công"
      }),
      
      // Thông tin cho đọc sách
      ...(activity.action === "Đọc" && {
        book: {
          id: "BOOK" + Math.floor(1000 + Math.random() * 9000),
          title: "Đắc Nhân Tâm",
          author: "Dale Carnegie",
          category: "Kỹ năng sống",
          coverImage: "https://example.com/book-cover.jpg"
        },
        pagesRead: Math.floor(10 + Math.random() * 20),
        description: "Đọc sách Đắc Nhân Tâm"
      }),
      
      // Thông tin cho thu nhập
      ...(activity.action === "Thu nhập" && {
        book: {
          id: "BOOK" + Math.floor(1000 + Math.random() * 9000),
          title: "Nhà Giả Kim",
          author: "Paulo Coelho",
          category: "Tiểu thuyết",
          coverImage: "https://example.com/book-cover.jpg"
        },
        incomeType: "Hoàn thành đọc sách",
        description: "Thu nhập từ việc hoàn thành đọc sách Nhà Giả Kim"
      }),
      
      relatedActivities: [
        { id: "PH089", action: "Nạp", points: "+50", date: "2024-02-15" },
        { id: "PH102", action: "Đọc", points: "-10", date: "2024-01-05" },
        { id: "PH103", action: "Thu nhập", points: "+20", date: "2024-01-10" }
      ]
    };
    
    setSelectedActivity(detailedActivity);
    setShowModal(true);
  };

  // Hàm phụ trợ để tạo phương thức thanh toán ngẫu nhiên
  const getRandomPaymentMethod = () => {
    const methods = ["MoMo E-Wallet", "Ngân hàng VietComBank", "Ngân hàng BIDV", "ZaloPay", "VNPay", "Thẻ Visa/Mastercard"];
    return methods[Math.floor(Math.random() * methods.length)];
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  // Lọc các hoạt động không phải Nạp, Đọc hoặc Thu nhập
  const validHistory = pointHistory.filter(history => 
    history.action === "Nạp" || history.action === "Đọc" || history.action === "Thu nhập"
  );

  // Lọc và sắp xếp lịch sử điểm
  const filteredHistory = validHistory
    .filter(history => {
      return (
        (history.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
         history.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!actionFilter || history.action === actionFilter)
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
      } else if (sortConfig.key === 'points') {
        // Sắp xếp theo điểm
        const pointsA = parseInt(a.points);
        const pointsB = parseInt(b.points);
        if (sortConfig.direction === 'asc') {
          return pointsA - pointsB;
        } else {
          return pointsB - pointsA;
        }
      }
      return 0;
    });

  const getActionClass = (action) => {
    switch(action) {
      case 'Nạp':
        return 'deposit';
      case 'Đọc':
        return 'read';
      case 'Thu nhập':
        return 'income';
      default:
        return '';
    }
  };

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const displayedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusClass = (status) => {
    switch(status) {
      case 'Thành công':
        return 'success';
      case 'Đang xử lý':
        return 'pending';
      case 'Thất bại':
        return 'failed';
      case 'Hoàn tiền':
        return 'refunded';
      default:
        return '';
    }
  };

  return (
    <div className="point-management">
      <h1>🎯 Lịch Sử Điểm Thành Viên</h1>
      
      <div className="header-actions">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-container">
          <select 
            value={actionFilter} 
            onChange={handleActionFilterChange}
          >
            <option value="">Tất cả hoạt động</option>
            <option value="Nạp">Nạp</option>
            <option value="Đọc">Đọc</option>
            <option value="Thu nhập">Thu nhập</option>

          </select>

          <button 
            className="sort-btn" 
            onClick={() => handleSort('date')}
          >
            Sắp xếp theo thời gian {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </button>

          <button 
            className="sort-btn" 
            onClick={() => handleSort('points')}
          >
            Sắp xếp theo điểm {sortConfig.key === 'points' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Mã giao dịch</th>
            <th>Tên người dùng</th>
            <th>Điểm</th>
            <th>Hoạt động</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {displayedHistory.map((history) => (
            <tr 
              key={history.id} 
              onClick={() => handleRowClick(history)}
              className="clickable-row"
            >
              <td>{history.id}</td>
              <td>{history.username}</td>
              <td className={`points ${parseInt(history.points) >= 0 ? 'positive' : 'negative'}`}>
                {history.points}
              </td>
              <td>
                <span className={`action-tag ${getActionClass(history.action)}`}>
                  {history.action}
                </span>
              </td>
              <td>{history.date}</td>
              <td>
                <span className={`status-tag ${getStatusClass(history.status || 'Thành công')}`}>
                  {history.status || 'Thành công'}
                </span>
              </td>
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

      {/* Modal chi tiết hoạt động */}
      {showModal && selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={handleCloseModal}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ManagePointPage;
