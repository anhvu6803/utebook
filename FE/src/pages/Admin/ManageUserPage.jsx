import { useState, useEffect } from "react";
import "./styles/ManageUserPage.scss";
import SearchIcon from "@mui/icons-material/Search";
import UserDetailForm from "../../components/Admin/UserDetailForm";
import UserEditForm from "../../components/Admin/EditUserModal";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = 'http://localhost:5000/api/user';

const ManageUserPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const usersPerPage = 10;

  // Fetch users data
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setUsers(response.data.data);
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Lưu user sau khi chỉnh sửa
  const handleSaveUser = async (updatedUser) => {
    try {
      const response = await axios.patch(`${API_URL}/${updatedUser._id}`, updatedUser);
      setUsers(users.map((u) => (u._id === updatedUser._id ? response.data.data : u)));
      setEditingUser(null);
      setSelectedUser(null); // Đóng modal sau khi cập nhật
      toast.success("Cập nhật người dùng thành công");
      fetchUsers(); // Refresh danh sách người dùng
    } catch (error) {
      toast.error("Không thể cập nhật người dùng");
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      setSelectedUser(null); // Đóng modal
      toast.success("Xóa người dùng thành công");
      fetchUsers(); // Load lại dữ liệu
    } catch (error) {
      toast.error("Không thể xóa người dùng");
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="user-management">
      <div className="search-bar">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Bảng danh sách người dùng */}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Fullname</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user._id} className="clickable-row" onClick={() => setSelectedUser(user)}>
                <td>{user.username}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.numberPhone}</td>
                <td className={`role ${user.isAdmin ? "admin" : "user"}`}>
                  {user.isAdmin ? "Admin" : "User"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-users">Không tìm thấy người dùng!</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Trước
          </button>
          <span>Trang {currentPage} / {totalPages}</span>
          <button className="pagination-btn" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Tiếp
          </button>
        </div>
      )}

      {/* Modal hiển thị thông tin user */}
      {selectedUser && (
        <UserDetailForm 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          onUpdate={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      )}

      {/* Modal chỉnh sửa user */}
      {editingUser && (
        <UserEditForm user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />
      )}
    </div>
  );
};

export default ManageUserPage;
