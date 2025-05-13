import { useState } from 'react';
import { Form, Input, Button, Select, message, Card, Space, Typography, Tag } from 'antd';
import { SendOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './styles/ManageNotification.scss';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const ManageNotification = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);

  // Giả lập danh sách người dùng (thay thế bằng API call thực tế)
  const mockUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@example.com' },
  ];

  const handleUserSearch = (value) => {
    if (value) {
      const filteredUsers = mockUsers.filter(
        user => 
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase())
      );
      setUserOptions(filteredUsers.map(user => ({
        value: `user_${user.id}`,
        label: `${user.name} (${user.email})`
      })));
    } else {
      setUserOptions([]);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // TODO: Implement API call to send notification
      console.log('Giá trị thông báo:', values);
      message.success('Gửi thông báo thành công!');
      form.resetFields();
    } catch (error) {
      message.error('Gửi thông báo thất bại');
      console.error('Lỗi khi gửi thông báo:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOption = (option) => {
    if (option.value.startsWith('user_')) {
      return (
        <Space>
          <UserOutlined />
          <span>{option.label}</span>
        </Space>
      );
    }
    return option.label;
  };

  return (
    <div className="manage-notification">
      <Card className="notification-container">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="header-section">
            <Title level={2}>
              <SendOutlined /> Gửi Thông Báo
            </Title>
            <Text type="secondary">
              Gửi thông báo tới người dùng hoặc nhóm người dùng cụ thể
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="notification-form"
          >
            <Form.Item
              name="title"
              label={
                <Space>
                  <InfoCircleOutlined />
                  <span>Tiêu Đề Thông Báo</span>
                </Space>
              }
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề thông báo' }]}
            >
              <Input placeholder="Nhập tiêu đề thông báo" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Loại Thông Báo"
              rules={[{ required: true, message: 'Vui lòng chọn loại thông báo' }]}
            >
              <Select placeholder="Chọn loại thông báo">
                <Option value="info">
                  <Tag color="blue">Thông tin</Tag>
                </Option>
                <Option value="warning">
                  <Tag color="orange">Cảnh báo</Tag>
                </Option>
                <Option value="success">
                  <Tag color="green">Thành công</Tag>
                </Option>
                <Option value="error">
                  <Tag color="red">Lỗi</Tag>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="recipients"
              label={
                <Space>
                  <UserOutlined />
                  <span>Người Nhận</span>
                </Space>
              }
              rules={[{ required: true, message: 'Vui lòng chọn người nhận' }]}
              help="Chọn nhóm người dùng hoặc tìm kiếm người dùng cụ thể"
            >
              <Select
                mode="multiple"
                placeholder="Chọn nhóm hoặc tìm kiếm người dùng"
                className="recipients-select"
                showSearch
                onSearch={handleUserSearch}
                filterOption={false}
                options={[
                  { value: 'all', label: 'Tất cả người dùng' },
                  { value: 'membership', label: 'Người dùng Hội viên' },
                  ...userOptions
                ]}
                optionLabelProp="label"
                optionRender={renderOption}
              />
            </Form.Item>

            <Form.Item
              name="message"
              label="Nội Dung Thông Báo"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung thông báo' }]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập nội dung thông báo"
                className="message-textarea"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="submit-button"
                icon={<SendOutlined />}
                size="large"
              >
                Gửi Thông Báo
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default ManageNotification;
