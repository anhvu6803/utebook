import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./styles/ManageMembershipPage.scss";
import MembershipDetailModal from "../../components/Admin/MembershipDetailModal";
import AdminPasswordModal from "../../components/Admin/AdminPasswordModal";
import axios from 'axios';

const itemsPerPage = 8;

const ManageMembershipPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/history-packages');
        if (response.data.success) {
          setTransactions(response.data.data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm xử lý khi thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Hàm xử lý khi thay đổi bộ lọc loại hội viên
  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };

  // Hàm xử lý khi thay đổi bộ lọc trạng thái
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Hàm xử lý khi thay đổi cách sắp xếp
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Hàm xử lý khi click vào một dòng trong bảng
  const handleRowClick = async (transaction) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/history-packages/${transaction._id}`);
      if (response.data.success) {
        setPendingTransaction(response.data.data);
        setShowPasswordModal(true);
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };

  // Thêm hàm để xử lý thay đổi trạng thái
  const handleStatusChange = async (transactionId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/history-packages/${transactionId}`, { status: newStatus });
      if (response.data.success) {
        // Cập nhật trạng thái trong transactions state
        const updatedTransactions = transactions.map(transaction => {
          if (transaction._id === transactionId) {
            return {
              ...transaction,
              status: newStatus
            };
          }
          return transaction;
        });
        
        setTransactions(updatedTransactions);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Thêm hàm để xử lý thành công xác thực
  const handlePasswordConfirm = () => {
    setShowPasswordModal(false);
    setSelectedTransaction(pendingTransaction);
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

  // Lọc và sắp xếp danh sách giao dịch
  const filteredTransactions = transactions
    .filter(transaction => {
      return (
        (transaction.id_user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         transaction._id?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!typeFilter || transaction.packageId?.name === typeFilter) &&
        (!statusFilter || transaction.status === statusFilter)
      );
    })
    .sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        if (sortConfig.direction === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      } else if (sortConfig.key === 'price') {
        const priceA = parseInt(a.transactionId?.amount);
        const priceB = parseInt(b.transactionId?.amount);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            <option value="UTEBOOK 1 ngày">Gói 1 ngày</option>
            <option value="UTEBOOK 1 tháng">Gói 1 tháng</option>
            <option value="UTEBOOK 6 tháng">Gói 6 tháng</option>
            <option value="UTEBOOK 1 năm">Gói 1 năm</option>
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
              key={transaction._id} 
              onClick={() => handleRowClick(transaction)}
              className="clickable-row"
            >
              <td>{transaction._id}</td>
              <td>{transaction.id_user?.username}</td>
              <td>
                <span className={`type-tag ${getTypeClass(transaction.packageId?.name)}`}>
                  {transaction.packageId?.name}
                </span>
              </td>
              <td>{transaction.packageId?.expire} ngày</td>
              <td>{parseInt(transaction.transactionId?.amount).toLocaleString()} VNĐ</td>
              <td>{transaction.transactionId?.vnp_CardType}</td>
              <td>
                <span className={`status-tag ${getStatusClass(transaction.status)}`}>
                  {transaction.status}
                </span>
              </td>
              <td>
                {new Date(transaction.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
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

      {showPasswordModal && (
        <AdminPasswordModal
          onClose={handlePasswordModalClose}
          onConfirm={handlePasswordConfirm}
        />
      )}

      {showModal && selectedTransaction && (
        <MembershipDetailModal
          membership={selectedTransaction}
          onClose={handleCloseModal}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ManageMembershipPage; 