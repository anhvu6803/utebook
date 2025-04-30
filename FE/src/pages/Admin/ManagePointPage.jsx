import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./styles/ManagePointPage.scss";
import ActivityDetailModal from "../../components/Admin/ActivityDeailModal";
import axios from "axios";

const itemsPerPage = 8;

const ManagePointPage = () => {
  const [pointHistory, setPointHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: 'time',
    direction: 'desc' // Sắp xếp mặc định theo thời gian giảm dần (mới nhất)
  });
  const [actionFilter, setActionFilter] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchHistoryPoints = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/history-points');
        if (response.data && response.data.success) {
          setPointHistory(response.data.data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching history points:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryPoints();
  }, []);

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
      if (item._id === activityId) {
        return {
          ...item,
          status: newStatus
        };
      }
      return item;
    });
    
    setPointHistory(updatedHistory);
    
    // Tìm và cập nhật hoạt động được chọn hiện tại để modal hiển thị đúng
    if (selectedActivity && selectedActivity._id === activityId) {
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
      time: activity.createdAt || activity.time, // Sử dụng createdAt nếu có, nếu không thì dùng time
      description: `${activity.type} điểm thành viên`,
      userId: activity.id_user,
      previousBalance: activity.type === "Nạp" || activity.type === "Thu nhập" 
        ? (activity.number_point_HoaPhuong - 100).toString() 
        : (Math.abs(activity.number_point_HoaPhuong) + 100).toString(),
      currentBalance: activity.type === "Nạp" || activity.type === "Thu nhập" 
        ? (activity.number_point_HoaPhuong + 100).toString() 
        : (100 - Math.abs(activity.number_point_HoaPhuong)).toString(),
      
      // Thông tin cho nạp điểm
      ...(activity.type === "Nạp" && {
        paymentMethod: activity.transactionInfo?.vnp_BankCode || 'Chưa xác định',
        transactionId: activity.transactionInfo?._id,
        amount: activity.transactionInfo?.amount,
        adminApproved: "Admin001",
        approvalDate: new Date(activity.createdAt || activity.time).toLocaleString(),
        remarks: "Thanh toán thành công",
        transactionInfo: activity.transactionInfo // Thêm thông tin transaction
      }),
      
      // Thông tin cho đọc sách
      ...(activity.type === "Đọc" && activity.bookInfo && {
        book: {
          id: activity.bookInfo._id,
          title: activity.bookInfo.title,
          author: "Tác giả sách",
          category: "Thể loại sách",
          coverImage: "https://example.com/book-cover.jpg"
        },
        pagesRead: Math.floor(10 + Math.random() * 20),
        description: `Đọc sách ${activity.bookInfo.title}`
      }),
      
      // Thông tin cho thu nhập
      ...(activity.type === "Thu nhập" && activity.bookInfo && {
        book: {
          id: activity.bookInfo._id,
          title: activity.bookInfo.title,
          author: "Tác giả sách",
          category: "Thể loại sách",
          coverImage: "https://example.com/book-cover.jpg"
        },
        incomeType: "Hoàn thành đọc sách",
        description: `Thu nhập từ việc hoàn thành đọc sách ${activity.bookInfo.title}`
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
    history.type === "Nạp" || history.type === "Đọc" || history.type === "Thu nhập"
  );

  // Lọc và sắp xếp lịch sử điểm
  const filteredHistory = validHistory
    .filter(history => {
      return (
        (history.userInfo?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         history._id.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!actionFilter || history.type === actionFilter)
      );
    })
    .sort((a, b) => {
      if (sortConfig.key === 'time') {
        // Sắp xếp theo ngày tháng
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        if (sortConfig.direction === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      } else if (sortConfig.key === 'points') {
        // Sắp xếp theo điểm
        const pointsA = a.number_point_HoaPhuong;
        const pointsB = b.number_point_HoaPhuong;
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

  // Format date to display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Format points to display with + or -
  const formatPoints = (points, type) => {
    if (type === "Nạp" || type === "Thu nhập") {
      return `+${points}`;
    } else {
      return `${points}`;
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

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
            onClick={() => handleSort('time')}
          >
            Sắp xếp theo thời gian {sortConfig.key === 'time' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
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
              key={history._id} 
              onClick={() => handleRowClick(history)}
              className="clickable-row"
            >
              <td>{history._id}</td>
              <td>{history.userInfo?.username || 'Không xác định'}</td>
              <td className={`points ${history.type === "Nạp" || history.type === "Thu nhập" ? 'positive' : 'negative'}`}>
                {formatPoints(history.number_point_HoaPhuong, history.type)}
              </td>
              <td>
                <span className={`action-tag ${getActionClass(history.type)}`}>
                  {history.type}
                </span>
              </td>
              <td>{formatDate(history.time)}</td>
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
