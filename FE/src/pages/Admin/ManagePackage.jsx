import { useState, useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import './styles/ManagePackage.scss';

const ManagePackage = () => {
  const [activeTab, setActiveTab] = useState('membership');
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [membershipForm, setMembershipForm] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    expire: '',
  });
  const [pointForm, setPointForm] = useState({
    name: '',
    quantity_HoaPhuong: '',
    quantity_La: '',
    price: ''
  });

  useEffect(() => {
    fetchPackages();
  }, [activeTab]);

  const fetchPackages = async () => {
    try {
      const endpoint = activeTab === 'membership' 
        ? 'http://localhost:5000/api/membership-packages'
        : 'http://localhost:5000/api/point-packages';
      
      const response = await axios.get(endpoint);
      const packagesData = response.data?.data || response.data;
      setPackages(Array.isArray(packagesData) ? packagesData : []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleMembershipInputChange = (e) => {
    const { name, value } = e.target;
    setMembershipForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePointInputChange = (e) => {
    const { name, value } = e.target;
    setPointForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = activeTab === 'membership'
        ? 'http://localhost:5000/api/membership-packages'
        : 'http://localhost:5000/api/point-packages';

      let formData;
      if (activeTab === 'membership') {
        formData = {
          ...membershipForm,
          expire: parseInt(membershipForm.duration)
        };
      } else {
        formData = {
          ...pointForm,
          quantity_HoaPhuong: parseInt(pointForm.quantity_HoaPhuong),
          quantity_La: parseInt(pointForm.quantity_La),
          price: parseInt(pointForm.price)
        };
      }

      await axios.post(endpoint, formData);
      
      setShowModal(false);
      if (activeTab === 'membership') {
        setMembershipForm({
          name: '',
          price: '',
          duration: '',
          description: '',
          expire: '',
        });
      } else {
        setPointForm({
          name: '',
          quantity_HoaPhuong: '',
          quantity_La: '',
          price: ''
        });
      }
      fetchPackages();
    } catch (error) {
      console.error('Error creating package:', error);
    }
  };

  return (
    <div className="manage-package">
      <div className="package-header">
        <h2>Quản lý gói dịch vụ</h2>
        <button className="add-package-btn" onClick={() => setShowModal(true)}>
          <AddIcon /> Thêm gói mới
        </button>
      </div>

      <div className="package-tabs">
        <div className="tab-buttons">
          <button 
            className={activeTab === 'membership' ? 'active' : ''} 
            onClick={() => handleTabChange('membership')}
          >
            Gói thành viên
          </button>
          <button 
            className={activeTab === 'points' ? 'active' : ''} 
            onClick={() => handleTabChange('points')}
          >
            Gói điểm
          </button>
        </div>
      </div>

      <div className="package-list">
        {Array.isArray(packages) && packages.map((pkg) => (
          <div key={pkg._id} className="package-card">
            <div className="package-header">
              <h3>{activeTab === 'membership' ? pkg.name : pkg.name}</h3>
            </div>
            <div className="package-details">
              {activeTab === 'membership' ? (
                <>
                  <div className="detail-item">
                    <span className="label">Giá:</span>
                    <span className="value">{pkg.price?.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Thời hạn:</span>
                    <span className="value">{pkg.expire} ngày</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Mô tả:</span>
                    <span className="value">{pkg.description}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="detail-item">
                    <span className="label">Giá:</span>
                    <span className="value">{pkg.price?.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Điểm Hoa Phượng:</span>
                    <span className="value">{pkg.quantity_HoaPhuong?.toLocaleString('vi-VN')} điểm</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Điểm Lá:</span>
                    <span className="value">{pkg.quantity_La?.toLocaleString('vi-VN')} điểm</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Ngày tạo:</span>
                    <span className="value">{new Date(pkg.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Thêm gói {activeTab === 'membership' ? 'thành viên' : 'điểm'} mới</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {activeTab === 'membership' ? (
                <>
                  <div className="form-group">
                    <label>Tên gói</label>
                    <input
                      type="text"
                      name="name"
                      value={membershipForm.name}
                      onChange={handleMembershipInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Giá (VNĐ)</label>
                    <input
                      type="number"
                      name="price"
                      value={membershipForm.price}
                      onChange={handleMembershipInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Thời hạn (ngày)</label>
                    <input
                      type="number"
                      name="duration"
                      value={membershipForm.duration}
                      onChange={handleMembershipInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mô tả</label>
                    <input
                      type="text"
                      name="description"
                      value={membershipForm.description}
                      onChange={handleMembershipInputChange}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Tên gói</label>
                    <input
                      type="text"
                      name="name"
                      value={pointForm.name}
                      onChange={handlePointInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Giá (VNĐ)</label>
                    <input
                      type="number"
                      name="price"
                      value={pointForm.price}
                      onChange={handlePointInputChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Số điểm Hoa Phượng</label>
                    <input
                      type="number"
                      name="quantity_HoaPhuong"
                      value={pointForm.quantity_HoaPhuong}
                      onChange={handlePointInputChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Số điểm Lá</label>
                    <input
                      type="number"
                      name="quantity_La"
                      value={pointForm.quantity_La}
                      onChange={handlePointInputChange}
                      required
                      min="0"
                    />
                  </div>
                </>
              )}
              <div className="modal-footer">
                <button type="button" className="cancel" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="submit">
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePackage;
