import { useState, useEffect } from "react";
import "./styles/ManageCategoryPage.scss";
// Import các icons cần thiết
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import AdminPasswordModal from "../../components/Admin/AdminPasswordModal";

const ManageCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ name: "" });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const categoriesPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/category");
      if (response.data.success) {
        setCategories(response.data.data);
        setFilteredCategories(response.data.data);
      } else {
        setError("Không thể lấy danh sách thể loại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải danh sách thể loại");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filteredData = categories.filter((category) =>
      category.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filteredData);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: "" });
    setError("");
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setError("");
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (category) => {
    setActionType('delete');
    setCategoryToDelete(category);
    setShowAdminModal(true);
  };

  const handleAdminConfirm = async () => {
    try {
      if (actionType === 'delete' && categoryToDelete) {
        await axios.delete(`http://localhost:5000/api/category/${categoryToDelete._id}`, {
          withCredentials: true
        });
        await fetchCategories(); // Refresh category list
        showToast("Xóa thể loại thành công");
      }
      setShowAdminModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();

    if (trimmedName.length < 2) {
      setError("Tên thể loại phải có ít nhất 2 ký tự");
      return;
    }

    try {
      if (editingCategory) {
        // Update category
        const response = await axios.put(
          `http://localhost:5000/api/category/${editingCategory._id}`,
          { name: trimmedName },
          {
            withCredentials: true
          }
        );
        if (response.data.success) {
          await fetchCategories(); // Refresh category list
          showToast("Cập nhật thể loại thành công");
        }
      } else {
        // Add new category
        const response = await axios.post(
          "http://localhost:5000/api/category",
          { name: trimmedName },
          {
            withCredentials: true
          }
        );
        if (response.data.success) {
          await fetchCategories(); // Refresh category list
          showToast("Thêm thể loại thành công");
        }
      }
      setIsModalOpen(false);
      setFormData({ name: "" });
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  if (loading) {
    return <div className="category-page loading">Đang tải...</div>;
  }

  return (
    <div className="category-page">
      <div className="category-content">
        <div className="page-title">
          <h1>Quản lý thể loại</h1>
        </div>

        <div className="page-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm thể loại..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <SearchIcon className="search-icon" />
          </div>
          <button className="btn-add" onClick={handleAddCategory}>
            <AddIcon className="plus-icon" />
            Thêm thể loại
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên thể loại</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.length > 0 ? (
                currentCategories.map((category, index) => (
                  <tr key={category._id}>
                    <td>{indexOfFirstCategory + index + 1}</td>
                    <td>{category.name}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditCategory(category)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">
                    Không tìm thấy thể loại!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Tiếp
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingCategory ? "Sửa thể loại" : "Thêm thể loại mới"}</h2>
                <button
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                >
                  <CloseIcon />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên thể loại</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="Nhập tên thể loại"
                  />
                  {error && <span className="error">{error}</span>}
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setIsModalOpen(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCategory ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAdminModal && (
          <AdminPasswordModal
            onClose={() => setShowAdminModal(false)}
            isOpen={showAdminModal}
            onConfirm={handleAdminConfirm}
            onCancel={() => {
              setShowAdminModal(false);
              setCategoryToDelete(null);
            }}
            action="xóa"
            message="Vui lòng nhập mật khẩu admin để xóa thể loại"
          />
        )}
      </div>
    </div>
  );
};

export default ManageCategoryPage;
