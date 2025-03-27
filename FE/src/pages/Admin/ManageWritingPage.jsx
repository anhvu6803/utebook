import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, TextField, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import WritingDetailModal from '../../components/Admin/WritingDetailModal';
import './styles/ManageWritingPage.scss';

// Thêm data mẫu ở đầu file, sau phần import
const writingsData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Tác phẩm ${i + 1}`,
  author: `Tác giả ${i + 1}`,
  category: i % 3 === 0 ? "Truyện ngắn" : i % 3 === 1 ? "Thơ" : "Tiểu thuyết",
  submitDate: new Date(2024, 0, i + 1).toLocaleDateString('vi-VN'),
  status: i % 4 === 0 ? "pending" : i % 4 === 1 ? "approved" : i % 4 === 2 ? "rejected" : "pending",
  content: `Nội dung của tác phẩm ${i + 1}. Đây là phần nội dung mẫu để test hiển thị...`,
  description: `Mô tả ngắn về tác phẩm ${i + 1}. Tác phẩm này nói về...`,
}));

const ManageWritingPage = () => {
  const [writings, setWritings] = useState(writingsData);
  const [filteredWritings, setFilteredWritings] = useState(writingsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedWriting, setSelectedWriting] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const writingsPerPage = 10;

  // Xử lý tìm kiếm
  useEffect(() => {
    const filtered = writings.filter(writing => 
      (writing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       writing.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'all' || writing.status === filterStatus)
    );
    setFilteredWritings(filtered);
  }, [searchTerm, filterStatus, writings]);

  // Tính toán writings cho trang hiện tại
  const indexOfLastWriting = currentPage * writingsPerPage;
  const indexOfFirstWriting = indexOfLastWriting - writingsPerPage;
  const currentWritings = filteredWritings.slice(indexOfFirstWriting, indexOfLastWriting);
  const totalPages = Math.ceil(filteredWritings.length / writingsPerPage);

  // Reset về trang 1 khi search hoặc filter
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handleViewDetails = (writing) => {
    setSelectedWriting(writing);
    setOpenDialog(true);
  };

  const handleStatusChange = async (id, newStatus, reason = '') => {
    try {
      // API call để thay đổi trạng thái
      console.log('Change status:', id, 'New status:', newStatus, 'Reason:', reason);
      
      // Cập nhật state
      setWritings(prevWritings =>
        prevWritings.map(w =>
          w.id === id 
            ? { 
                ...w, 
                status: newStatus,
                rejectReason: newStatus === 'rejected' ? reason : null
              } 
            : w
        )
      );
      
      // Đóng modal nếu cần
      setSelectedWriting(null);
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  return (
    <div className="manage-writing-page">
      <div className="page-header">
        <h1>Quản lý phê duyệt tác phẩm</h1>
        <div className="filters">
          <div className="search-box">
            <SearchIcon />
            <TextField
              placeholder="Tìm kiếm theo tên hoặc tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="status-filter">
            <FilterListIcon />
            <TextField
              select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ duyệt</MenuItem>
              <MenuItem value="approved">Đã duyệt</MenuItem>
              <MenuItem value="rejected">Từ chối</MenuItem>
            </TextField>
          </div>
        </div>
      </div>

      <TableContainer component={Paper} className="writings-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên tác phẩm</TableCell>
              <TableCell>Tác giả</TableCell>
              <TableCell>Thể loại</TableCell>
              <TableCell>Ngày nộp</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentWritings.map((writing) => (
              <TableRow 
                key={writing.id}
                onClick={() => handleViewDetails(writing)}
                className="writing-row"
                hover
              >
                <TableCell>{writing.title}</TableCell>
                <TableCell>{writing.author}</TableCell>
                <TableCell>{writing.category}</TableCell>
                <TableCell>{writing.submitDate}</TableCell>
                <TableCell>
                  <span className={`status ${writing.status}`}>
                    {writing.status === 'pending' && 'Chờ duyệt'}
                    {writing.status === 'approved' && 'Đã duyệt'}
                    {writing.status === 'rejected' && 'Từ chối'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
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
      </TableContainer>

      {/* Modal chi tiết */}
      {selectedWriting && (
        <WritingDetailModal
          writing={selectedWriting}
          onClose={() => setSelectedWriting(null)}
          onApprove={(id) => handleStatusChange(id, 'approved')}
          onReject={(writing, reason) => handleStatusChange(writing.id, 'rejected', reason)}
        />
      )}
    </div>
  );
};

export default ManageWritingPage;
