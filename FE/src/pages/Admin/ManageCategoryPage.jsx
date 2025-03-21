import { useState, useEffect } from "react";
import "./styles/ManageCategoryPage.scss";
import { Button, Table, Modal, Input, Form, message } from "antd";

const { Search } = Input;

const ManageCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const initialCategories = [
      { id: 1, name: "Tiểu thuyết" },
      { id: 2, name: "Khoa học" },
      { id: 3, name: "Lịch sử" },
    ];
    setCategories(initialCategories);
    setFilteredCategories(initialCategories);
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    const filteredData = categories.filter((category) =>
      category.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filteredData);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditCategory = (record) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id) => {
    const newCategories = categories.filter((category) => category.id !== id);
    setCategories(newCategories);
    setFilteredCategories(newCategories);
    message.success("Đã xóa thể loại thành công!");
  };

  const handleModalOk = () => {
    form.validateFields()
      .then((values) => {
        const trimmedName = values.name.trim().toLowerCase();

        // Kiểm tra trùng lặp
        const isDuplicate = categories.some((cat) =>
          cat.name.trim().toLowerCase() === trimmedName &&
          (!editingCategory || cat.id !== editingCategory.id)
        );

        if (isDuplicate) {
          form.setFields([
            {
              name: "name",
              errors: [`Thể loại "${values.name}" đã tồn tại!`],
            },
          ]);
          return;
        }

        if (editingCategory) {
          // Cập nhật thể loại
          const updatedCategories = categories.map((cat) =>
            cat.id === editingCategory.id ? { ...cat, ...values } : cat
          );
          setCategories(updatedCategories);
          setFilteredCategories(updatedCategories);
          message.success(`Cập nhật thể loại "${values.name}" thành công!`);
        } else {
          // Thêm thể loại mới
          const newCategory = { id: categories.length + 1, ...values };
          const updatedCategories = [...categories, newCategory];
          setCategories(updatedCategories);
          setFilteredCategories(updatedCategories);
          message.success(`Thêm thể loại "${values.name}" thành công!`);
        }

        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  const columns = [
    {
      title: "Tên thể loại",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="action-buttons">
          <Button onClick={() => handleEditCategory(record)} type="primary">Sửa</Button>
          <Button onClick={() => handleDeleteCategory(record.id)} danger>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="book-category-management">
      <div className="container">
        <h2>Quản Lý Thể Loại Sách</h2>

        {/* Thanh tìm kiếm */}
        <div className="search-container">
          <Search
            placeholder="Tìm kiếm thể loại..."
            allowClear
            onSearch={handleSearch}
            className="search-input"
          />
        </div>

        {/* Nút thêm thể loại */}
        <div className="button-container">
          <Button type="primary" onClick={handleAddCategory} className="add-button">Thêm Thể Loại</Button>
        </div>

        {/* Bảng danh sách thể loại */}
        <Table
          dataSource={filteredCategories}
          columns={columns}
          rowKey="id"
          className="category-table"
          pagination={{ pageSize: 5 }}
        />

        {/* Modal thêm/sửa thể loại */}
        <Modal
          title={editingCategory ? "Chỉnh Sửa Thể Loại" : "Thêm Thể Loại"}
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên thể loại"
              rules={[{ required: true, message: "Vui lòng nhập tên thể loại!" }]}
            >
              <Input placeholder="Nhập tên thể loại..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageCategoryPage;
