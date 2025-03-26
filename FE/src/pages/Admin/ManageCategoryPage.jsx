import { useState, useEffect } from "react";
import "./styles/ManageCategoryPage.scss";
// Import các icons cần thiết
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const ManageCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ name: "" });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  useEffect(() => {
    const initialCategories = [
      { id: 1, name: "Tiểu thuyết" },
      { id: 2, name: "Khoa học" },
      { id: 3, name: "Lịch sử" },
      { id: 4, name: "Truyện" },
      { id: 5, name: "Tâm lý" },
      { id: 6, name: "Viễn tưởng" },
      { id: 7, name: "Kinh dị" },
      { id: 8, name: "Viễn tưởng" },
      { id: 9, name: "Kinh dị" },
      { id: 10, name: "Viễn tưởng" },
      { id: 11, name: "Kinh dị" },
      { id: 12, name: "Viễn tưởng" },
      { id: 13, name: "Kinh dị" },
      { id: 14, name: "Viễn tưởng" },
      { id: 15, name: "Kinh dị" },
      { id: 16, name: "Viễn tưởng" },
      { id: 17, name: "Kinh dị" },
      { id: 18, name: "Viễn tưởng" },
      { id: 19, name: "Kinh dị" },
      { id: 20, name: "Viễn tưởng" },
      { id: 21, name: "Kinh dị" },
      
      
    ];
    setCategories(initialCategories);
    setFilteredCategories(initialCategories);
    setCurrentPage(1);
  }, []);

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

  const handleDeleteCategory = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thể loại này?")) {
      const newCategories = categories.filter((category) => category.id !== id);
      setCategories(newCategories);
      setFilteredCategories(newCategories);
      showToast("Xóa thể loại thành công");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();

    if (trimmedName.length < 2) {
      setError("Tên thể loại phải có ít nhất 2 ký tự");
      return;
    }

    const isDuplicate = categories.some(
      (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase() &&
      (!editingCategory || cat.id !== editingCategory.id)
    );

    if (isDuplicate) {
      setError(`Thể loại "${trimmedName}" đã tồn tại`);
      return;
    }

    if (editingCategory) {
      const updatedCategories = categories.map((cat) =>
        cat.id === editingCategory.id ? { ...cat, name: trimmedName } : cat
      );
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
      showToast("Cập nhật thể loại thành công");
    } else {
      const newCategory = {
        id: Date.now(),
        name: trimmedName
      };
      setCategories([...categories, newCategory]);
      setFilteredCategories([...categories, newCategory]);
      showToast("Thêm thể loại thành công");
    }

    setIsModalOpen(false);
    setFormData({ name: "" });
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
                  <tr key={category.id}>
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
                          onClick={() => handleDeleteCategory(category.id)}
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
      </div>
    </div>
  );
};

export default ManageCategoryPage;
