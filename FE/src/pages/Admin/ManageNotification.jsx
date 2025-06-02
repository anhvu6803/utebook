import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Card, Space, Typography, Tag } from 'antd';
import { SendOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './styles/ManageNotification.scss';
import axios from 'axios';
import CustomAlert from '../../components/CustomAlert';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const ManageNotification = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user');
        setAllUsers(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllUsers();
  }, []);

  const handleUserSearch = (value) => {
    if (value) {
      console.log(allUsers);
      const filteredUsers = allUsers.filter(
        user =>
          user.fullname.toLowerCase().includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase())
      );
      setUserOptions(filteredUsers.map(user => ({
        value: `${user._id}`,
        label: `${user.fullname} (${user.email})`
      })));
    } else {
      setUserOptions([]);
    }
  };

  const onFinish = async (values) => {
    console.log('Form values:', values);
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:5000/api/notification/${values.recipients}`, {
        type: values.type,
        title: values.title,
        content: values.content
      });
      setAlert({
        open: true,
        message: 'Gửi thông báo thành công',
        severity: 'success'
      });
      form.resetFields();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Gửi thông báo thất bại',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderOption = (option) => {
    if (option.value !== 'all' && option.value !== 'membership') {
      return (
        <Space>
          <UserOutlined />
          <span>{option.label}</span>
        </Space>
      );
    }
    return option.label;
  };

  const handleCreateCoupon = async () => {
    try {
      const Random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const randomAmount = Random(100, 1000); // sinh trước

      const response = await axios.post('http://localhost:5000/api/coupon', {
        discount: randomAmount
      });

      console.log(response.data.data);
      const notify = `Chúng tôi tặng bạn coupon : ${response.data.data.coupon} nhận ${response.data.data.discount} hoa phượng`;
      form.setFieldsValue({ content: notify });
    } catch (error) {
      console.error(error);
    }
  };


  const handleSelectReciver = (value) => {
    console.log('Giá trị được chọn:', value);
    // Bạn có thể xử lý tiếp ở đây (gửi lên state, API, v.v.)
  };
  const handleTypeChange = async (value) => {
    try {
      if (value === 'coupon') {
        await handleCreateCoupon();
      }
    } catch (errorInfo) {

    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
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
              <Select
                placeholder="Chọn loại thông báo"
                onChange={handleTypeChange}
              >
                <Option value="info">
                  <Tag color="blue">Thông tin</Tag>
                </Option>
                <Option value="coupon">
                  <Tag color="green">Coupon</Tag>
                </Option>
                <Option value="warning">
                  <Tag color="orange">Cảnh báo</Tag>
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
                placeholder="Chọn nhóm hoặc tìm kiếm người dùng"
                className="recipients-select"
                showSearch
                onSearch={handleUserSearch}
                filterOption={false}
                onSelect={handleSelectReciver}
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
              name="content"
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

      <CustomAlert alert={alert} handleCloseAlert={handleCloseAlert} />

    </div>
  );
};

export default ManageNotification;
