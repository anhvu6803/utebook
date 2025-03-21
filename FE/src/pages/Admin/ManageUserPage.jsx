import { useState } from "react";
import "./styles/ManageUserPage.scss";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserDetailForm from "../../components/Admin/UserDetailForm";
import UserEditForm from "../../components/Admin/EditUserModal";
import AdminPasswordModal from "../../components/Admin/AdminPasswordModal";

const usersData = Array.from({ length: 50 }, (_, i) => ({
  username: `user${i + 1}`,
  fullname: `Người Dùng ${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `012345678${i % 10}`,
  address: `Địa chỉ ${i + 1}, Thành phố XYZ`,
  avatar: `https://i.pravatar.cc/100?img=${i % 70}`,
  membership: i % 2 === 0,
  membershipDays: i % 2 === 0 ? Math.floor(Math.random() * 365) + 1 : 0,
  role: i % 2 === 0 ? "Admin" : "User",
}));

const ManageUserPage = () => {
  const [users, setUsers] = useState(usersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [adminPasswordModal, setAdminPasswordModal] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const usersPerPage = 10;

  const filteredUsers = users.filter((user) =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Mở modal xác nhận admin cho sửa
  const openEditAdminConfirm = (user) => {
    setAdminPasswordModal({ user, action: "edit" });
  };

  // Mở modal xác nhận admin cho xóa
  const openDeleteAdminConfirm = (user) => {
    setUserToDelete(user);
    setAdminPasswordModal({ user, action: "delete" });
  };

  // Xác nhận admin và thực hiện hành động
  const handleAdminConfirm = (user, action) => {
    if (action === "edit") {
      setEditingUser(user);
    } else if (action === "delete") {
      setUsers(users.filter((u) => u.username !== user.username));
    }
    setAdminPasswordModal(null);
    setUserToDelete(null);
  };

  // Lưu user sau khi chỉnh sửa
  const handleSaveUser = (updatedUser) => {
    setUsers(users.map((u) => (u.username === updatedUser.username ? updatedUser : u)));
    setEditingUser(null);
  };

  return (
    <div className="user-management">
      <div className="title">Quản lý người dùng</div>
      <div className="search-bar">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user, index) => (
              <tr key={index} className="clickable-row" onClick={() => setSelectedUser(user)}>
                <td>{user.username}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td className={`role ${user.role.toLowerCase()}`}>{user.role}</td>
                <td className="actions">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditAdminConfirm(user);
                    }}
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteAdminConfirm(user);
                    }}
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-users">Không tìm thấy người dùng!</td>
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

      {/* Modal xác nhận admin */}
      {adminPasswordModal && (
        <AdminPasswordModal
          user={adminPasswordModal.user}
          action={adminPasswordModal.action}
          onConfirm={() => handleAdminConfirm(adminPasswordModal.user, adminPasswordModal.action)}
          onCancel={() => setAdminPasswordModal(null)}
        />
      )}

      {/* Modal hiển thị thông tin user */}
      {selectedUser && (
        <UserDetailForm user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {/* Modal chỉnh sửa user */}
      {editingUser && (
        <UserEditForm user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />
      )}
    </div>
  );
};

export default ManageUserPage;
