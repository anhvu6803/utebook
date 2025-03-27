import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import "./styles/ManageEventPage.scss";
import EventModal from "../../components/Admin/EventModal";
import EditEventModal from "../../components/Admin/EditEventModal";

// Hàm format date an toàn
const formatDate = (dateString) => {
  try {
    // Nếu dateString đã ở dạng dd/mm/yyyy thì trả về luôn
    if (dateString.includes('/')) {
      return dateString;
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Data mẫu với ngày tháng hợp lệ
const eventsData = Array.from({ length: 20 }, (_, i) => {
  // Tạo ngày bắt đầu từ hôm nay
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + i); // Mỗi sự kiện cách nhau 1 ngày

  // Ngày kết thúc sau ngày bắt đầu 7 ngày
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7);

  // Format ngày trực tiếp thành dd/mm/yyyy
  const formatToString = (date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  return {
    id: `event${i + 1}`,
    title: `Sự kiện ${i + 1}`,
    description: `Mô tả chi tiết cho sự kiện ${i + 1}. Đây là sự kiện giảm giá đặc biệt nhân dịp...`,
    startDate: formatToString(startDate),
    endDate: formatToString(endDate),
    status: ["Sắp diễn ra", "Đang diễn ra", "Đã kết thúc"][Math.floor(Math.random() * 3)],
    discountedBooks: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, j) => ({
      id: `book${i}_${j}`,
      title: `Sách ${j + 1} của sự kiện ${i + 1}`,
      originalPrice: Math.floor(Math.random() * 200000) + 50000,
      discountPercent: Math.floor(Math.random() * 50) + 10,
      image: `https://picsum.photos/seed/book${i}_${j}/100/150`
    }))
  };
});

const ManageEventPage = () => {
  const [events, setEvents] = useState(eventsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const eventsPerPage = 6;

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error converting date for input:', error);
      return '';
    }
  };

  const formatDateForSave = (dateString) => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error converting date for save:', error);
      return '';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Sắp diễn ra": return "upcoming";
      case "Đang diễn ra": return "ongoing";
      case "Đã kết thúc": return "ended";
      default: return "";
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowAddModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleSubmitAdd = (eventData) => {
    const newEvent = {
      ...eventData,
      id: `event${events.length + 1}`,
    };
    setEvents([...events, newEvent]);
    setShowAddModal(false);
  };

  const handleSubmitEdit = (eventData) => {
    setEvents(events.map(event => 
      event.id === selectedEvent.id ? { ...eventData, id: event.id } : event
    ));
    setShowEditModal(false);
  };

  const renderEventCard = (event) => (
    <div key={event.id} className="event-card">
      <div className="event-header">
        <h3>{event.title}</h3>
        <span className={`status-badge ${getStatusClass(event.status)}`}>
          {event.status}
        </span>
      </div>
      
      <div className="event-info">
        <p className="description">{event.description}</p>
        
        <div className="event-dates">
          <div className="date-item">
            <span className="label">Bắt đầu:</span>
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="date-item">
            <span className="label">Kết thúc:</span>
            <span>{formatDate(event.endDate)}</span>
          </div>
        </div>

        <div className="discounted-books">
          <h4>Sách được giảm giá ({event.discountedBooks.length}):</h4>
          <div className="books-list">
            {event.discountedBooks.map((book) => (
              <div key={book.id} className="book-item">
                <div className="book-info">
                  <img src={book.image} alt={book.title} className="book-image" />
                  <div className="book-details">
                    <span className="book-title">{book.title}</span>
                    <div className="book-prices">
                      <span className="original-price">{formatPrice(book.originalPrice)}</span>
                      <span className="discount-badge">-{book.discountPercent}%</span>
                      <span className="final-price">
                        {formatPrice(book.originalPrice * (1 - book.discountPercent / 100))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="event-actions">
        <button className="edit-btn" onClick={() => handleEditEvent(event)}>
          Chỉnh sửa
        </button>
        <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)}>
          Xóa
        </button>
      </div>
    </div>
  );

  return (
    <div className="event-management">
      <div className="page-header">
        <h1>Quản lý sự kiện</h1>
        <div className="header-actions">
          <div className="search-bar">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button className="add-event-btn" onClick={handleAddEvent}>
            <AddIcon /> Thêm sự kiện mới
          </button>
        </div>
      </div>

      <div className="events-grid">
        {currentEvents.length > 0 ? (
          currentEvents.map(renderEventCard)
        ) : (
          <div className="no-events">Không tìm thấy sự kiện nào</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <div className="pagination-info">
            <span>Trang {currentPage} / {totalPages}</span>
          </div>
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Tiếp
          </button>
        </div>
      )}

      <EventModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitAdd}
      />

      <EditEventModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSubmitEdit}
        event={selectedEvent}
      />
    </div>
  );
};

export default ManageEventPage;
